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


def _get_sess_collection(token):
    decoded = None
    try:
        decoded = jwt.decode(token, "SECRET_KET", algorithms=["HS256"])
    except:
        return None
    uid = decoded.get("uid")
    
    return sessionCollection.find({"uid": uid})
def delete_session(token):
    collection =  _get_sess_collection(token)
    if collection == None: 
        return
    
    for item in collection:
        if(bcrypt.checkpw(token.encode(), item["token"])):
            sessionCollection.delete_one({'token': item["token"]})
            return

def validateSession(token):
    collection =  _get_sess_collection(token)
    if collection == None: 
        return False
    
    for item in collection:
        if(bcrypt.checkpw(token.encode(), item["token"])):
            return True
    return False
