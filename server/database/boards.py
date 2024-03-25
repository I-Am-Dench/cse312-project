from . import db
import random 

all_boards = db["boards"]

# functions related to boards


# creates a new board in the db
def createBoard(title, creatorID):
    boardID = random.randint(1, 1000000000)
    markedDeleted = False
    comments = []
    all_boards.insert_one(
        {
            "title": title,
            "boardID": boardID,
            "creatorID": creatorID,
            "comments": comments,
            "markedDeleted": markedDeleted,
        }
    )
    return boardID


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
        boardHistory = list(all_boards.find({}, {"_id": 0, "markedDeleted": 0}))
    return boardHistory