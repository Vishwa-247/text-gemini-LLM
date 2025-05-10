
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from bson import ObjectId
import json
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import router
from routers.chat import chat_router

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Register router
app.register_blueprint(chat_router)

# JSON Encoder for MongoDB ObjectId and datetime
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)

app.json_encoder = JSONEncoder

if __name__ == '__main__':
    app.run(debug=True)
