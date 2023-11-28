import gridfs
from pymongo import MongoClient


def mongo_conn():
    try:
        # uri = "mongodb://localhost:27017/"
        uri = "mongodb://mongo-root:mongo-root@localhost:27017/"
        conn = MongoClient(uri)
        return conn
    except Exception as e:
        print("Error while connecting to mongo db", e)


mongo = mongo_conn()['flow']
img_fs = gridfs.GridFS(mongo, collection="img")
