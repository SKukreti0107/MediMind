

from bson import ObjectId
from datetime import datetime



def user_schema(email, password_hash):
    """Returns a dictionary representing a user document."""
    return {
        "email": email,
        "password_hash": password_hash,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

def chat_schema(user_id, title="New Chat"):
    """Returns a dictionary representing a chat document."""
    return {
        "user_id": ObjectId(user_id), 
        "title": title,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

def message_schema(chat_id, user_id, role, content):
    """Returns a dictionary representing a message document."""
    if role not in ["user", "assistant"]:
        raise ValueError("Role must be either 'user' or 'assistant'")
    return {
        "chat_id": ObjectId(chat_id), 
        "user_id": ObjectId(user_id), 
        "role": role,
        "content": content,
        "timestamp": datetime.utcnow()
    }


def serialize_doc(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    if doc and "user_id" in doc:
        doc["user_id"] = str(doc["user_id"])
    if doc and "chat_id" in doc:
        doc["chat_id"] = str(doc["chat_id"])

    for key, value in doc.items():
        if isinstance(value, datetime):
            doc[key] = value.isoformat()
    return doc