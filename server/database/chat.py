from . import db

_chats = db["chat"]


def add_chat(room, message, chatID, avatar):
    new_chat = {
        "room": room,
        "message": message,
        "user": chatID,
        "avatar": avatar,
    }
    _chats.insert_one(new_chat)


def get_chats(room_id):
    return list(_chats.find({"room": room_id}, {"_id": False, "room": False}))
