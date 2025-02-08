from pymongo import MongoClient

MONGO_URI = "mongodb+srv://armaitykatki:fillosophyai@cluster0.iax4s.mongodb.net/" #connect to DB using URI
client = MongoClient(MONGO_URI)
db = client["fill-osophyai"] #access fill-osophy.ai DB, if not it creates one
collection = db["forms"] #access collection of forms
