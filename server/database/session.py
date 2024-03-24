from . import db
import jwt
import datetime
import bcrypt

EXPIRES = 3600
sessionCollection = db["session"]
sessionCollection.create_index("expiresIn", expireAfterSeconds=EXPIRES)


def create_session_token(userID):
    try:
        token = {"uid": userID}
        return jwt.encode(token, "SECRET_KET", algorithm="HS256").encode()
    except Exception as e:
        return e


def createSession(userID):
    token = create_session_token(userID)
    expires = datetime.datetime.now(datetime.UTC)
    hashToken = bcrypt.hashpw(token, bcrypt.gensalt())
    bv = sessionCollection.insert_one(
        {
            "token": hashToken,
            "expiresIn": expires + datetime.timedelta(0, EXPIRES),
            "uid": userID,
        }
    )
    res = sessionCollection.find_one({"token": hashToken})
    return {"token": token.decode("utf-8"), "expires": res["expiresIn"]}

def delete_session(token):
    decoded = None
    try:
        decoded = jwt.decode(token, "SECRET_KET", algorithms=["HS256"])
    except:
        return False
    uid = decoded.get("uid")
    collection = sessionCollection.find({"uid": uid})
    
    for item in collection:
        if(bcrypt.checkpw(token.encode(), item["token"])):
            sessionCollection.delete_one({'token': item["token"]})
            return

def validateSession(token):
    decoded = None
    try:
        decoded = jwt.decode(token, "SECRET_KET", algorithms=["HS256"])
    except:
        return False
    uid = decoded.get("uid")
    collection = sessionCollection.find({"uid": uid})
    
    for item in collection:
        if(bcrypt.checkpw(token.encode(), item["token"])):
            return True
    return False
