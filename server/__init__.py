from flask import Flask, request, jsonify, Response
from http import client
import json 

from .database import accounts, session, comments

def create_app(test_config=None):
    app = Flask(__name__, static_folder='./static', static_url_path='/')

    @app.after_request
    def apply_no_sniff(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response
    
    @app.route('/')
    def send_index():
        return app.send_static_file('index.html')

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
        
        response.set_data(json.dumps({'username': account['username']}))
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

    @app.route('/api/boards/<board_id>/comments', methods=['POST'])
    def add_comment(board_id):
        user_id = request.json['user_id']
        content = request.json['content']
        comment_id = comments.create_comment(board_id, user_id, content)
        return jsonify({"comment_id": str(comment_id)}), 201

    @app.route('/api/boards/<board_id>/comments/<comment_id>', methods=['DELETE'])
    def remove_comment(board_id, comment_id):
        user_id = request.json['user_id']  # In a real app, the user ID should be retrieved from the session or token
        success = comments.delete_comment(comment_id, user_id)
        if success:
            return jsonify({"success": True}), 204
        else:
            return jsonify({"error": "Comment could not be deleted"}), 403

    @app.route('/api/users/<username>', methods=['GET'])
    def get_user(username):
        user = accounts.find_account(username)
        if user:
            return jsonify(user), 200
        else:
            return jsonify({"error": "User not found"}), 404

    @app.route('/api/boards', methods=['GET', 'POST'])
    def boards():
        if request.method == 'GET':
            boards = database.retrieveBoards()
            return jsonify(boards), 200
        elif request.method == 'POST':
            title = request.json.get('title')
            creatorID = request.json.get('creatorID')  # Ensure this is sent in the request body
            board_id = database.createBoard(title, creatorID)
            return jsonify({"id": board_id}), 201

    @app.route('/api/boards/<boardId>', methods=['GET', 'DELETE'])
    def board(boardId):
        if request.method == 'GET':
            board = database.retrieveBoards(boardId)
            if board:
                return jsonify(board), 200
            else:
                return jsonify({"error": "Board not found"}), 404
        elif request.method == 'DELETE':
            database.deleteBoard(boardId)
            return jsonify({"success": "Board marked as deleted"}), 200
    
    return app