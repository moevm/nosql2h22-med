import sys
from flask import Flask
from flask import request
from flask import Response
import json
import pymongo
import logging

app = Flask(__name__)
client = None
db = None
db_collection = None
resource = None

status = {
    "HTTP_200_OK": 200,
    "HTTP_400_BAD_REQUEST": 400
}

int_field = ['id', 'medicalSubjectId', 'grade']

headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "GET,PUT,POST,OPTIONS",
    "Access-Control-Allow-Methods": "*"
}

app.config['CORS_HEADERS'] = headers


@app.route("/", methods=['GET'])
def hello():
    logging.info("hello")
    args = request.args.get("name", default=None, type=None)

    return Response(f"Hello {args}!", headers=headers)


def getField(field, value):
    if field in int_field:
        return int(value)
    return value


@app.route('/medical', methods=['GET'])
def GetHospitalList():
    logging.info("GetMedicalList")
    try:

        keys = request.args.to_dict()

        # Переменная первого элемента
        firstElement = \
            (int(request.args.get('firstElement', default=None, type=int)) if keys.get('firstElement') else 1)

        # Переменная количества элементов
        countElement = \
            (int(request.args.get('countElement', default=None, type=int)) if keys.get('countElement') else 20)

        # Переменная сортировки
        if keys.get('sort'):
            buff = (request.args.get('sort', default=None, type=str)).split(":")
            sort = [(buff[0], int(buff[1]))]
        else:
            sort = []

        # Переменная поиска
        search = \
            (request.args.get('search', default=None, type=str) if keys.get('search') else None)

        if search is not None:
            filters = {'$text': {'$search': search}}
        else:
            filters = {}

        if keys.get('filters'):
            for key_value in (request.args.get('filters', default=None, type=str)).split(','):
                key = key_value.split(':')[0]
                value = key_value.split(':')[1]
                filters[key] = getField(key, value)

    except TypeError:
        return 'Arguments type error!', status['HTTP_400_BAD_REQUEST']
    except AttributeError:
        return 'Argument error!', status['HTTP_400_BAD_REQUEST']

    ret = db_collection.find(
        filter=filters,
        projection=(
            {
                '_id': False,
                'score': {'$meta': 'textScore'}
            }
            if filters.get('$text') else
            {
                '_id': False
            }
        ),
        skip=firstElement - 1,
        limit=countElement,
        sort=sort
    )

    if filters.get('$text'):
        ret = ret.sort([('score', {'$meta': 'textScore'})])

    json_list = list(ret)

    # Если поиск пустой, то поиск еще раз
    if len(json_list) == 0:
        filters.pop('$text')
        ret = db_collection.find(
            filter=filters,
            projection=(
                {
                    '_id': False
                }
            ),
            skip=firstElement - 1,
            limit=countElement
        ).sort([('search_index', 1)])
        logging.info("Еще запрос")
        json_list = list(ret)

    print(f'Count documents: {len(json_list)}')

    return Response(json.dumps(json_list), headers=headers)


@app.route('/import', methods=['POST'])
def PostHospitalList():
    try:
        data = request.get_json(force=True)

    except TypeError:
        return 'Arguments type error!', status['HTTP_400_BAD_REQUEST']
    except AttributeError:
        return 'Argument error!', status['HTTP_400_BAD_REQUEST']

    matched_count = 0
    modified_count = 0
    for document in data:
        find = db_collection.replace_one({'id': document['id']}, document, True)
        matched_count += find.matched_count
        modified_count += find.modified_count

    return Response(f"Import done! Matched count: {matched_count}. Modified count: {modified_count}", headers=headers)


@app.route('/medical/<int:id_med>', methods=['GET'])
def GetHospital(id_med):
    print('GetMedical')

    ret = db_collection.find_one({"id": id_med})
    ret['_id'] = str(ret['_id'])

    return Response(json.dumps(ret), headers=headers)


def run_update():
    print('Удаляем ненужное')
    db_collection.update_many({}, {'$unset': {'oid': 1}}, False)
    db_collection.update_many({}, {'$unset': {'oldOid': 1}}, False)
    db_collection.update_many({}, {'$unset': {'organizationType': 1}}, False)
    db_collection.update_many({}, {'$unset': {'moDeptId': 1}}, False)
    db_collection.update_many({}, {'$unset': {'moDeptName': 1}}, False)
    db_collection.update_many({}, {'$unset': {'moLevel': 1}}, False)
    db_collection.update_many({}, {'$unset': {'profileAgencyKindId': 1}}, False)
    db_collection.update_many({}, {'$unset': {'profileAgencyKind': 1}}, False)

    print('Меняем типы')
    for data in db_collection.find({}):
        for key in data.keys():
            if key == 'id':
                data[key] = int(data[key])
            if key == 'medicalSubjectId':
                data[key] = int(data[key])
            if key == 'fiasVersion':
                data['fiasVersion'] = int(data['fiasVersion'])
            if key == 'addrRegionId':
                data['addrRegionId'] = int(data['addrRegionId'])
            if key == 'territoryCode':
                data['territoryCode'] = int(data['territoryCode'])
            if key == 'grade':
                data['grade'] = int(data['grade'])

        db_collection.update_one({'_id': data['_id']}, {'$set': data}, upsert=False)

    print('Образуем адрес')
    for data in db_collection.find({}):
        addr = {}
        if data.get('postIndex') is not None:
            addr['postIndex'] = data['postIndex']
        if data.get('latitude') is not None:
            addr['latitude'] = data['latitude']
        if data.get('longtitude') is not None:
            addr['longtitude'] = data['longtitude']
        if data.get('fiasVersion') is not None:
            addr['fiasVersion'] = data['fiasVersion']
        if data.get('aoidStreet') is not None:
            addr['aoidStreet'] = data['aoidStreet']
        if data.get('houseid') is not None:
            addr['houseid'] = data['houseid']
        if data.get('addrRegionId') is not None:
            addr['addrRegionId'] = data['addrRegionId']
        if data.get('addrRegionName') is not None:
            addr['addrRegionName'] = data['addrRegionName']
        if data.get('territoryCode') is not None:
            addr['territoryCode'] = data['territoryCode']
        if data.get('isFederalCity') is not None:
            addr['isFederalCity'] = data['isFederalCity']
        if data.get('streetName') is not None:
            addr['streetName'] = data['streetName']
        if data.get('prefixStreet') is not None:
            addr['prefixStreet'] = data['prefixStreet']
        if data.get('house') is not None:
            addr['house'] = data['house']
        if len(addr) != 0:
            data['addr'] = addr

            db_collection.update_one({'_id': data['_id']}, {'$set': data}, upsert=False)

    db_collection.update_many({}, {'$unset': {'postIndex': 1}}, False)
    db_collection.update_many({}, {'$unset': {'latitude': 1}}, False)
    db_collection.update_many({}, {'$unset': {'longtitude': 1}}, False)
    db_collection.update_many({}, {'$unset': {'fiasVersion': 1}}, False)
    db_collection.update_many({}, {'$unset': {'aoidStreet': 1}}, False)
    db_collection.update_many({}, {'$unset': {'houseid': 1}}, False)
    db_collection.update_many({}, {'$unset': {'addrRegionId': 1}}, False)
    db_collection.update_many({}, {'$unset': {'addrRegionName': 1}}, False)
    db_collection.update_many({}, {'$unset': {'territoryCode': 1}}, False)
    db_collection.update_many({}, {'$unset': {'isFederalCity': 1}}, False)
    db_collection.update_many({}, {'$unset': {'streetName': 1}}, False)
    db_collection.update_many({}, {'$unset': {'prefixStreet': 1}}, False)
    db_collection.update_many({}, {'$unset': {'house': 1}}, False)

    print('Изменение базы закончено!')


def run_update_indexes():
    db.collection.ensureIndex({"subject": "text", "content": "text"})


def evaluateMemory():
    max = {}
    keys = db_collection.find_one({}).keys()
    for k in keys:
        max[k] = 0
    for data in db_collection.find({}):
        for key in keys:
            if data.get(key) is not None and max[key] < sys.getsizeof(data[key]):
                max[key] = sys.getsizeof(data[key])
    # print(f'{key} : {sys.getsizeof(data[key])}')
    for i in keys:
        print(f'{i} : {max[i]} bytes')

    string = 'N * ( '
    summ = 0
    for i in keys:
        string += f'{max[i]} + '
        summ += max[i]
    string = (string[:-2] + ')' + f' = N * {summ}')
    print(string)
<<<<<<< HEAD


@app.route('/internal/getCities', methods=['GET'])
def getCities():
    cities = db_collection.distinct('addr.addrRegionName')
    return Response(json.dumps(cities), headers=headers)


@app.route('/internal/getSpecialties', methods=['GET'])
def getSpecialties():
    specialties = db_collection.distinct('specialties')
    return Response(json.dumps(specialties), headers=headers)
=======
>>>>>>> 18d0c8db28444e0afad013f7ce7a1b0a8267e500


if __name__ == "__main__":
    print("App run")
    try:
<<<<<<< HEAD
        f = open('app/resources.json', 'r')
        # f = open('resources.json', 'r')
=======
        # f = open('app/resources.json', 'r')
        f = open('resources.json', 'r')
>>>>>>> 18d0c8db28444e0afad013f7ce7a1b0a8267e500
        resource = json.load(f)
        client = pymongo.MongoClient(resource['db_address'])
        db = client[resource['db_name']]
        db_collection = db.get_collection(resource['db_collection'])

        # run_update_indexes()
        app.run(host=resource['domain'])

    except IOError:
        print("Resource file open error!")
        logging.error("Resource file open error!")
