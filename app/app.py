# from pymongo import MongoClient
# import pprint
#
# if __name__ == '__main__':
#
#     print('Connect to db')
#     client = MongoClient('mongodb://localhost:27017/')
#
#     db = client['demodb']
#     collection = db['hello_world']
#
#     print('Droping collection')
#     db.drop_collection('demodb')
#
#     entry_inserted_id = db.collection.insert_one({"hello": "world"}).inserted_id
#     print("Inserted entry: " + str(entry_inserted_id))
#
#     for a in db.collection.find():
#         pprint.pprint(a)
import sys
from flask import Flask
from flask import request
import json
import pymongo
import logging


app = Flask(__name__)
client = None
db = None
db_collection = None
resource = None


@app.route("/")
def hello():
    logging.info("hello")
    args = request.args.get("name", default=None, type=None)
    return f"Hello {args}!"


@app.route('/medical')
def GetHospitalList():
    logging.info("GetMedicalList")
    ret = db_collection.find().sort("id").limit(5)
    data = []

    for i in range(5):
        data.append(ret.next())
        data[i]['_id'] = str(data[i]['_id'])

    return json.dumps(data)


@app.route('/medical/<int:id_med>')
def GetHospital(id_med):
    print("GetMedical")

    ret = db_collection.find_one({"id": id_med})
    ret['_id'] = str(ret['_id'])
    return json.dumps(ret)


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

    str = 'N * ( '
    summ = 0
    for i in keys:
        str += f'{max[i]} + '
        summ += max[i]
    str = (str[:-2] + ')' + f' = N * {summ}')
    print(str)


if __name__ == "__main__":
    print("App run")
    try:
        f = open('app/resources.json', 'r')
        resource = json.load(f)
        client = pymongo.MongoClient(resource['db_address'], serverSelectionTimeoutMS=5000)
        db = client[resource['db_name']]
        db_collection = db.get_collection(resource['db_collection'])
        app.run(host=resource['domain'])

    except IOError:
        print("Resource file open error!")
        logging.error("Resource file open error!")