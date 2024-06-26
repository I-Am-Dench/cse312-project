from . import db

from datetime import datetime
from bson import ObjectId
from secrets import token_urlsafe
from html import escape

chats = db['chats']

def create_comment(board_id, creator_id, content):
    comment_id = token_urlsafe()
    new_comment = {
        "id": comment_id,
        "BoardId": board_id,
        "CreatorId": creator_id,
        "Content": content,
        "Time": datetime.now()
    }
    chats.insert_one(new_comment)
    return comment_id

def create_media(board_id, creator_id, path):
    comment_id = token_urlsafe()
    new_comment = {
        "id": comment_id,
        "BoardId": board_id,
        "CreatorId": creator_id,
        "imageUrl": path,
        "Time": datetime.now()
    }
    chats.insert_one(new_comment)
    return comment_id

def delete_comment(comment_id, user_id):
    result = chats.delete_one({"id": comment_id})
    if result:
        return  result.deleted_count == 1
    else:
        return False
    
def delete_comments(board_id):
    chats.delete_many({"BoardId": board_id})
    
def get_comments(board_id):
    return list(chats.find({"BoardId": board_id}, {"_id": False}))
