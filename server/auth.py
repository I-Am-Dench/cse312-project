from .database import session
from flask import request, jsonify
from http import client

from functools import wraps

"""
Middleware function.

Verifies if the AUTH_TOKEN cookie for the current request is valid.
If invalid, it returns a 401 Unauthorized with a json error message. 

Use as a decorator on endpoint handlers.

```
    @app.route('/do_something')
    @with_valid_session         # notice missing parenthesis
    def do_something():
        ...
        return "...", 200
```
"""
def with_valid_session(func):
    @wraps(func)
    def _decorator(*args, **kwargs):
        token = request.cookies.get('AUTH_TOKEN', default=None)
        if token is None:
            return jsonify({'error': "Must provide an authentication token"}), client.UNAUTHORIZED
        
        if not session.validateSession(token):
            return jsonify({'error': "Invalid authentication token"}), client.UNAUTHORIZED

        return func(*args, **kwargs)

    return _decorator