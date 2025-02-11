from pymongo import MongoClient

MONGO_URI = "" #connect to DB using URI
client = MongoClient(MONGO_URI)
db = client["fill-osophyai"] #access fill-osophyai DB, if not it creates one
collection = db["forms"] #access collection of forms
