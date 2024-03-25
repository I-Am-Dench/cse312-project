from . import db
from .comments import get_comments, delete_comments

from secrets import token_urlsafe

all_boards = db["boards"]

# functions related to boards


# creates a new board in the db
def createBoard(title, creatorID):
    # boardID = random.randint(1, 1000000000)
    # markedDeleted = False
    comments = []
    boardId = token_urlsafe()
    all_boards.insert_one(
        {
            "id": boardId,
            "title": title,
            "boardID":  boardId,
            "creatorID": creatorID,
            "comments": comments
        }
    )
    return boardId


# deletes a board in the db
def deleteBoard(boardID):
    # query = {"_id": boardID}
    all_boards.delete_one({"boardID": boardID})
    delete_comments(boardID)


# gets all message boards or a specific one if path ends in boardID
def retrieveBoards():
    boardHistory = list(all_boards.find({}, {"_id": 0}))
    return boardHistory
# def retrieveBoards(boardID):
#     boardHistory = []
#     if boardID > 0:
#         boardHistory = list(all_boards.find({"id": boardID}, {"markedDeleted": True}))
#     else:
#         boardHistory = list(all_boards.find({}, {"markedDeleted": True}))
#     return boardHistory

def retrieveBoard(boardID):
    boardHistory = list(all_boards.find({"boardID": boardID}, {"_id": 0}))
    print(boardHistory)
    board = boardHistory[0]

    if board is None:
        return None
    
    # board["comments"] = get_comments(boardID)
    return {
        "board": board,
        "comments": get_comments(boardID)
    }
