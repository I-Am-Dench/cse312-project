from database import db
import jwt
import datetime
import bcrypt

sessionCollection = db["session"]
sessionCollection.create_index("expiresIn", expireAfterSeconds=3600)


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
        {"token": bcrypt.hashpw(token, bcrypt.gensalt()), "expiresIn": expires}
    )

    return {"token": token, "expires": expires}


def validateSession(token):
    t = bcrypt.hashpw(token, bcrypt.gensalt())

    bv = sessionCollection.find_one({"token": t})

    return bv
