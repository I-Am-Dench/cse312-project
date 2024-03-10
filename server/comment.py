from database import chats
from datetime import datetime
from bson import ObjectId

def create_comment(board_id, creator_id, content):
    new_comment = {
        "BoardId": board_id,
        "CreatorId": creator_id,
        "Content": content,
        "Time": datetime.now()
    }
    result = chats.insert_one(new_comment)
    return result.inserted_id

def delete_comment(comment_id, user_id):
    comment = chats.find_one({"_id": ObjectId(comment_id)})
    if comment and comment['CreatorId'] == user_id:
        result = chats.delete_one({"_id": ObjectId(comment_id)})
        return result.deleted_count == 1
    else:
        return False
