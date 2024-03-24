from pymongo import MongoClient


mongo_client = MongoClient("mongo")
db = mongo_client["projectDB"]
all_boards = db["boards"]
chats = db["chat"]
users = db["user"]

# functions related to boards


# creates a new board in the db
def createBoard(title, creatorID):
    markedDeleted = False
    comments = []
    all_boards.insert_one(
        {
            "title": title,
            "creatorID": creatorID,
            "comments": comments,
            "markedDeleted": markedDeleted,
        }
    )


# deletes a board in the db
def deleteBoard(boardID):
    query = {"_id": boardID}
    all_boards.update_one(query, {"markedDeleted": True})


# gets all message boards or a specific one if path ends in boardID
def retrieveBoards(boardID):
    boardHistory = []
    if boardID > 0:
        boardHistory = list(all_boards.find({"_id": boardID}, {"markedDeleted": True}))
    else:
        boardHistory = list(all_boards.find({}, {"markedDeleted": True}))
    return boardHistory



# Retrieves a user by username
def getUserByUsername(username):
    user = users.find_one({"username": username})
    return user
