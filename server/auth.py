import json
from .database import session
from flask import Response, request, jsonify
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
            return jsonify({'auth_error': "Must provide an authentication token"}), client.UNAUTHORIZED
        
        if not session.validateSession(token):
            response = Response(status=client.UNAUTHORIZED)
            response.set_cookie('AUTH_TOKEN', '', expires=0, httponly=True, samesite='Lax')
            response.set_data(json.dumps({'auth_error': "Auth token was invalid"}))
            return response
        
        
        return func(*args, **kwargs)

    return _decorator