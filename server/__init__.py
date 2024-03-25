from flask import Flask, request, jsonify, Response, Request
from http import client
import json

import jwt

from .auth import with_valid_session
from .database import accounts, session, comments, boards


def get_session_username(request: Request):
    token = request.cookies.get('AUTH_TOKEN', default=None)
    decoded = jwt.decode(token, "SECRET_KET", algorithms=["HS256"])
    username = decoded.get("uid")
    return username


def create_app(test_config=None):
    app = Flask(__name__, static_folder='./static', static_url_path='/')

    @app.after_request
    def apply_no_sniff(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        return response

    @app.route('/')
    def send_index():
        return app.send_static_file('index.html')

    @app.route('/auth/validate', methods=['POST'])
    @with_valid_session
    def auth_validate():
        token = request.cookies.get('AUTH_TOKEN', default=None)
        decoded = jwt.decode(token, "SECRET_KET", algorithms=["HS256"])
        username = decoded.get("uid")
        return jsonify({'username': username}), client.OK

    @app.route('/auth/login', methods=['POST'])
    def auth_login():
        if request.authorization is None:
            return jsonify({'error': "Missing Authorization header"}), client.BAD_REQUEST

        if request.authorization.type != 'basic':
            return jsonify(
                {'error': f"Unsupported Authorization type: {request.authorization.type}"}), client.BAD_REQUEST

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
        response = Response(status=client.NO_CONTENT)
        response.set_cookie('AUTH_TOKEN', '', expires=0, httponly=True, samesite='Lax')
        return response

    @app.route('/api/update-password', methods=['PUT'])
    @with_valid_session
    def update_password():
        token = request.cookies.get('AUTH_TOKEN', default=None)
        decoded = jwt.decode(token, "SECRET_KET", algorithms=["HS256"])
        username = decoded.get("uid")

        account = accounts.find_account(username)

        email = account['email']
        account = accounts.check_credentials(email, request.json["oldPassword"])

        if account is None:
            return jsonify({'error': "Invalid password"}), client.NOT_FOUND

        if request.json["newPassword"] != request.json["confirmPassword"]:
            return jsonify({'error': "passwords do not match"}), client.NOT_FOUND

        accounts.update_account_password(email, request.json["newPassword"])

        return jsonify({'success': "password was changed"}), client.ACCEPTED

    @app.route('/api/users', methods=['POST'])
    def create_user():
        data = request.get_json()

        username = data.get('username', None)
        if not accounts.is_valid_username(username):
            return jsonify({'error': "Invalid username"}), client.BAD_REQUEST
        
        email = data.get('email', None)
        if not accounts.is_valid_email(email):
            return jsonify({'error': "Invalid email"}), client.BAD_REQUEST

        password = data.get('password', None)
        if not accounts.is_valid_password(password):
            return jsonify({'error': "Invalid password"}), client.BAD_REQUEST

        confirm_password = data.get('confirmPassword', None)
        if password != confirm_password:
            return jsonify({'error': "Passwords do not match"}), client.BAD_REQUEST

        if accounts.find_account_by_email(email) is not None:
            return jsonify({'error': "Email is already in use"}), client.CONFLICT

        if not accounts.create_account(email, username, password):
            return jsonify({'error': "Username is already in use"}), client.CONFLICT

        return jsonify({'username': username}), client.CREATED

    @app.route('/api/boards/<board_id>/comments', methods=['POST'])
    @with_valid_session
    def add_comment(board_id):
        # user_id = request.json['user_id']
        username = get_session_username(request)
        content = request.json['content']
        comment_id = comments.create_comment(board_id, username, content)
        return jsonify({"comment_id": str(comment_id)}), 201

    @app.route('/api/boards/<board_id>/comments/<comment_id>', methods=['DELETE'])
    @with_valid_session
    def remove_comment(board_id, comment_id):
        # user_id = request.json['user_id']  
        username = get_session_username(request)
        success = comments.delete_comment(comment_id, username)
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

    @app.route('/api/boards', methods=['GET'])
    def access_boards():
        all_boards = boards.retrieveBoards()
        return jsonify(all_boards), 200

    @app.route('/api/boards', methods=['POST'])
    @with_valid_session
    def create_boards():
        title = request.json.get('title')
        username = get_session_username(request)
        # creatorID = request.json.get('creatorID')
        board_id = boards.createBoard(title, username)
        return jsonify({"id": board_id}), 201

    @app.route('/api/boards/<boardId>', methods=['GET'])
    def get_board(boardId):
        board = boards.retrieveBoard(boardId)
        if board:
            return jsonify(board), 200
        else:
            return jsonify({"error": "Board not found"}), 404

    @app.route('/api/boards/<boardId>', methods=['DELETE'])
    @with_valid_session
    def delete_board(boardId):
        board = boards.retrieveBoard(boardId)
        if board is None:
            return jsonify({"error": f"Not board with ID: {boardId}"}), client.NOT_FOUND
        
        if board.get('creatorID', '') != get_session_username(request):
            return jsonify({"error": "You do not have permission to delete this board"}), client.FORBIDDEN

        success = boards.deleteBoard(boardId)  # Adjust this to match your actual deletion method
        if success:
            return jsonify({"success": "Board successfully deleted"}), client.OK
        else:
            return jsonify({"error": "Failed to delete board or board not found"}), client.NOT_FOUND

    return app