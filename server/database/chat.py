import threading
from datetime import datetime
from . import db

_chats = db["chat"]

def add_chat(room, message, chatID, avatar):
    current_time = datetime.now().isoformat()  # Convert datetime to string
    new_chat = {
        "room": room,
        "message": message,
        "user": chatID,
        "avatar": avatar,
        "timestamp": current_time
    }
    _chats.insert_one(new_chat)

    # delete message after 1 minute
    timer = threading.Timer(600.0, delete_message, [new_chat])
    timer.start()

def get_chats(room_id):
    return list(_chats.find({"room": room_id}, {"_id": False, "room": False}))

def delete_message(chat):
    _chats.delete_one({"timestamp": chat['timestamp']})
