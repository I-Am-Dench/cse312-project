from flask import Flask, request, jsonify, Response
from http import client

from .database import accounts, session

def create_app(test_config=None):
    app = Flask(__name__)

    @app.after_request
    def apply_no_sniff(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response
    
    @app.route('/')
    def serve():
        return "<h1>Hello, world!</h1>", 200
    
    @app.route('/auth/login', methods=['POST'])
    def auth_login():
        if request.authorization is None:
            return jsonify({'error': "Missing Authorization header"}), client.BAD_REQUEST
        
        if request.authorization.type != 'basic':
            return jsonify({'error': f"Unsupported Authorization type: {request.authorization.type}"}), client.BAD_REQUEST
        
        email = request.authorization.get('username', '')
        password = request.authorization.get('password', '')

        account = accounts.check_credentials(email, password)
        if account is None:
            return jsonify({'error': "Invalid email and/or password"}), client.NOT_FOUND
        
        sess = session.createSession(account.get('username', ''))

        response = Response(status=client.OK)
        # set secure=True if we move over to HTTPS
        response.set_cookie('AUTH_TOKEN', sess['token'], expires=sess['expires'], httponly=True, samesite='Lax')

        return response

    @app.route('/auth/logout', methods=['POST'])
    def auth_logout():
        token = request.cookies.get('AUTH_TOKEN', None)
        if token is not None:
            session.delete_session(token)
        
        return "", client.NO_CONTENT

    @app.route('/api/users', methods=['POST'])
    def create_user():
        data = request.get_json()

        username = data.get('username', None)

        email = data.get('email', None)
        if not accounts.is_valid_email(email):
            return jsonify({'error': "Invalid email"}), client.BAD_REQUEST

        password = data.get('password', None)
        if not accounts.is_valid_password(password):
            return jsonify({'error': "Invalid password"}), client.BAD_REQUEST
        
        if accounts.find_account_by_email(email) is not None:
            return jsonify({'error': "Email is already in use"}), client.CONFLICT

        if not accounts.create_account(email, username, password):
            return jsonify({'error': "Username is already in use"}), client.CONFLICT
        
        return jsonify({'username': username}), client.CREATED
    
    return app