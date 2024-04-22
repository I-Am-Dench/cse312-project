from . import db

import bcrypt
import re

_accounts = db["accounts"]


def find_account(username: str) -> dict:
    return _accounts.find_one({"username": username}, {"_id": False})


def find_account_by_username(username: str) -> dict:
    return _accounts.find_one({"username": username}, {"_id": False})


def create_account(username: str, password: str) -> bool:
    if find_account(username) is not None:
        return False

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    _accounts.insert_one(
        {
            "username": username,
            "password": hashed,
            "picture": "",
        }
    )

    return True


# Returns the record of the account with the provided credential and None otherwise.
def check_credentials(username: str, password: str) -> dict:
    record = _accounts.find_one({"username": username}, {"_id": False})
    if record is None:
        return None

    stored_password = record.get("password")
    return record if bcrypt.checkpw(password.encode(), stored_password) else None


def update_account_password(username: str, password: str) -> bool:
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    result = _accounts.update_one(
        {"username": username}, {"$set": {"password": hashed}}
    )
    return result.modified_count > 0


# Util functions

_username_LOCAL_PATTERN = re.compile(
    r"[\w!#$%&'*+/=?^`{|}~-]+(\.[\w!#$%&'*+/=?^`{|}~-]+)*$"
)
_username_DOMAIN_PATTERN = re.compile(r"[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$")


def is_valid_username(username: str) -> bool:
    parts = username.split("@", 1)
    if len(parts) < 2:
        return False

    local, domain = parts[0], parts[1]
    if not re.match(_username_LOCAL_PATTERN, local):
        return False

    for label in domain.split("."):
        if not re.match(_username_DOMAIN_PATTERN, label):
            return False
    return True


_PASSWORD_REQUIREMENTS = [
    re.compile(r"[a-z]+"),
    re.compile(r"[A-Z]+"),
    re.compile(r"[0-9]+"),
    re.compile(r"[~!@#$%^&*_=-]+"),
]


def is_valid_password(password: str) -> bool:
    if len(password) < 8:
        return False

    for requirement in _PASSWORD_REQUIREMENTS:
        if not re.search(requirement, password):
            return False

    return True


def is_valid_username(username: str) -> bool:
    if len(username) == 0:
        return False

    return not not re.match("[a-zA-Z0-9._-]+$", username)


def update_picture(username: str, picturePath: str) -> bool:
    query = {"username": username}
    update = {"$set": {"picture": picturePath}}
    result = _accounts.update_one(query, update)
    return result.modified_count > 0
