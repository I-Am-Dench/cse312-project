from pymongo import MongoClient

mongo_client = MongoClient("mongo")
db = mongo_client["projectDB"]