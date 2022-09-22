from pymongo import MongoClient
import pprint

if __name__ == '__main__':
    print('Connect to db')
    client = MongoClient('mongodb://localhost:27017/')

    db = client['testdb']
    collection = db['hello_world']

    print('Droping collection')
    db.collection.drop()

    entry_inserted_id = db.collection.insert_one({"hello": "world"}).inserted_id
    print("Inserted entry: " + str(entry_inserted_id))

    for a in db.collection.find():
        pprint.pprint(a)
