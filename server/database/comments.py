from . import db

from datetime import datetime
from bson import ObjectId
from secrets import token_urlsafe

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

def delete_comment(comment_id, user_id):
    comment = chats.find_one({"id", comment_id}, {"_id": False})
    if comment and comment['CreatorId'] == user_id:
        result = chats.delete_one({"id": comment_id})
        return result.deleted_count == 1
    else:
        return False
    
def get_comments(board_id):
    return list(chats.find({"BoardId": board_id}, {"_id": False}))
