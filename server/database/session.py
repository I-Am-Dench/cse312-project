from database import db
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
    expires = datetime.datetime.utcnow()

    bv = sessionCollection.insert_one(
        {
            "token": bcrypt.hashpw(token, bcrypt.gensalt()),
            "expiresIn": expires,
            "uid": userID,
        }
    )
    return {"token": token, "expires": EXPIRES}


def validateSession(token):
    decoded = jwt.decode(token.decode("utf-8"))
    uid = decoded.get("uid")
    collection = sessionCollection.find_one({"uid": uid})
    return bcrypt.checkpw(token, collection["token"])
