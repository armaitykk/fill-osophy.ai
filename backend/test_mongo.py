import pymongo
import certifi

MONGO_URI = ""

try:
    # Attempt to connect to MongoDB using the certifi CA bundle
    client = pymongo.MongoClient(MONGO_URI, tlsCAFile=certifi.where())
    db = client["fill-osophyai"]
    collection = db["forms"]
    
    print("✅ Successfully connected to MongoDB!")
    print("Existing Collections:", db.list_collection_names())

except pymongo.errors.ServerSelectionTimeoutError as e:
    print("❌ MongoDB Connection Failed:", e)
