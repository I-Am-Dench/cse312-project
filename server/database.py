from pymongo import MongoClient

mongo_client = MongoClient("mongo")
db = mongo_client["projectDB"]
all_boards = db["boards"]
chats = db["chat"]

# functions related to boards

# creates a new board in the db
def createBoard(title, creatorID):
    markedDeleted = False
    comments = {}
    all_boards.insert_one({'title': title, 'creatorID': creatorID, 'comments': comments, 'markedDeleted': markedDeleted})

# deletes a board in the db
def deleteBoard(boardID):
    all_boards.update_one({'_id': boardID, "markedDeleted": True})

# gets all message boards or a specific one if path ends in boardID
def retrieveBoards(boardID):
    boardHistory = []
    if boardID > 0:
        boardHistory = list(all_boards.find({'_id': boardID}, {'markedDeleted': True}))
    else:
        boardHistory = list(all_boards.find({}, {'markedDeleted': True}))
    return boardHistory


