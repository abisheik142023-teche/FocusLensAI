from pymongo import MongoClient

# New database connection
client = MongoClient("mongodb://localhost:27017/")
db_new = client["focuslensai_new"]
collection = db_new["activities"]

# Example: insert a document
collection.insert_one({
    "userId": "user1",
    "appUsed": "App1",
    "activeTime": 120,
    "idleTime": 30,
    "keystrokes": 200,
    "sentimentScore": 0.5,
    "productivityLabel": "High",
    "focusScore": 0.8,
    "burnoutRisk": "Low"
})
