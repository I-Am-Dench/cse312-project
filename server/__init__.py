import os
import sys
import uuid

from flask import Flask, request, jsonify, Response, Request, send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room, disconnect
from http import client
import json

import jwt

from .auth import with_valid_session
from .database import accounts, session, comments, boards, chat


def get_session_username(request: Request):
    token = request.cookies.get("AUTH_TOKEN", default=None)
    decoded = jwt.decode(token, "SECRET_KET", algorithms=["HS256"])
    username = decoded.get("uid")
    return username


def create_app(test_config=None):
    app = Flask(__name__, static_folder="./static", static_url_path="/")
    app.config["UPLOAD_FOLDER"] = "/image/"
    os.makedirs(
        os.path.join(app.instance_path, app.config["UPLOAD_FOLDER"]), exist_ok=True
    )
    socketio = SocketIO(app, cors_allowed_origins="*", ssl_context="adhoc")

    @app.after_request
    def apply_no_sniff(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        return response

    @app.route("/")
    def send_index():
        return app.send_static_file("index.html")

    @app.route("/auth/validate", methods=["POST"])
    @with_valid_session
    def auth_validate():
        token = request.cookies.get("AUTH_TOKEN", default=None)
        decoded = jwt.decode(token, "SECRET_KET", algorithms=["HS256"])
        username = decoded.get("uid")
        imagePath = accounts.find_account(username)["picture"]
        return jsonify({"username": username, "avatar": imagePath}), client.OK

    @app.route("/auth/login", methods=["POST"])
    def auth_login():
        if request.authorization is None:
            return (
                jsonify({"error": "Missing Authorization header"}),
                client.BAD_REQUEST,
            )

        if request.authorization.type != "basic":
            return (
                jsonify(
                    {
                        "error": f"Unsupported Authorization type: {request.authorization.type}"
                    }
                ),
                client.BAD_REQUEST,
            )

        username = request.authorization.get("username", "")
        password = request.authorization.get("password", "")

        account = accounts.check_credentials(username, password)
        if account is None:
            return (
                jsonify({"error": "Invalid username and/or password"}),
                client.NOT_FOUND,
            )

        sess = session.createSession(account.get("username", ""))

        response = Response(status=client.OK)
        # set secure=True if we move over to HTTPS
        response.set_cookie(
            "AUTH_TOKEN",
            sess["token"],
            expires=sess["expires"],
            httponly=True,
            samesite="Lax",
        )

        response.set_data(json.dumps({"username": account["username"]}))
        return response

    @app.route("/auth/logout", methods=["POST"])
    def auth_logout():
        token = request.cookies.get("AUTH_TOKEN", None)
        if token is not None:
            session.delete_session(token)
        response = Response(status=client.NO_CONTENT)
        response.set_cookie("AUTH_TOKEN", "", expires=0, httponly=True, samesite="Lax")
        return response

    @app.route("/api/update-password", methods=["PUT"])
    @with_valid_session
    def update_password():
        token = request.cookies.get("AUTH_TOKEN", default=None)
        decoded = jwt.decode(token, "SECRET_KET", algorithms=["HS256"])
        username = decoded.get("uid")

        account = accounts.check_credentials(username, request.json["oldPassword"])

        if account is None:
            return jsonify({"error": "Invalid password"}), client.NOT_FOUND

        if request.json["newPassword"] != request.json["confirmPassword"]:
            return jsonify({"error": "passwords do not match"}), client.NOT_FOUND

        accounts.update_account_password(username, request.json["newPassword"])

        return jsonify({"success": "password was changed"}), client.ACCEPTED

    @app.route("/api/users", methods=["POST"])
    def create_user():
        data = request.get_json()

        username = data.get("username", None)
        if not accounts.is_valid_username(username):
            return jsonify({"error": "Invalid username"}), client.BAD_REQUEST

        password = data.get("password", None)
        if not accounts.is_valid_password(password):
            return jsonify({"error": "Invalid password"}), client.BAD_REQUEST

        confirm_password = data.get("confirmPassword", None)
        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), client.BAD_REQUEST

        if not accounts.create_account(username, password):
            return jsonify({"error": "Username is already in use"}), client.CONFLICT

        return jsonify({"username": username}), client.CREATED

    @app.route("/api/users/<username>/profile", methods=["POST"])
    @with_valid_session
    def add_profilePicture(username):
        # add functionality to update profile picture section in database
        username_token = get_session_username(request)

        if username != username_token:
            return jsonify({"error": "invalid request"}), client.CONFLICT
        if "image_upload" not in request.files:
            return jsonify({"error": "no files to upload"}), client.CONFLICT

        image_file = request.files["image_upload"]
        imagepath = os.path.join(
            app.instance_path,
            app.config["UPLOAD_FOLDER"],
            uuid.uuid4().hex + ".jpg",
        )
        # TODO: Make it so when user uploadeds a new file that same filename will be used.
        result = accounts.update_picture(username, imagepath)

        if result:
            image_file.save(imagepath)
            return jsonify({"success": imagepath}), 201
        else:
            return jsonify({"error": "Something went wrong"}), client.CONFLICT

    @app.route("/image/<path:image>", methods=["GET"])
    def get_image(image):
        return send_from_directory(app.config["UPLOAD_FOLDER"], image)

    @app.route("/api/boards/<board_id>/comments", methods=["POST"])
    @with_valid_session
    def add_comment(board_id):
        # user_id = request.json['user_id']
        username = get_session_username(request)
        content = request.json["content"]
        comment_id = comments.create_comment(board_id, username, content)
        return jsonify({"comment_id": str(comment_id)}), 201

    @app.route("/api/boards/<board_id>/media", methods=["POST"])
    def add_media(board_id):
        username = get_session_username(request)
        # content = request.json["content"]
        # add further functionality for media uploads
        # add functionality to update profile picture section in database
        # username_token = get_session_username(request)

        if "image_upload" not in request.files:
            return jsonify({"error": "no files to upload"}), client.CONFLICT

        image_file = request.files["image_upload"]
        imagepath = os.path.join(
            app.instance_path,
            app.config["UPLOAD_FOLDER"],
            uuid.uuid4().hex + ".jpg",
        )
        # TODO: Make it so when user uploadeds a new file that same filename will be used.
        result = comments.create_media(board_id, username, imagepath)
        image_file.save(imagepath)
        return jsonify({"comment_id": str(result)}), 201

    @app.route("/api/boards/<board_id>/comments/<comment_id>", methods=["DELETE"])
    @with_valid_session
    def remove_comment(board_id, comment_id):
        # user_id = request.json['user_id']
        username = get_session_username(request)
        success = comments.delete_comment(comment_id, username)
        if success:
            return jsonify({"success": True}), 204
        else:
            return jsonify({"error": "Comment could not be deleted"}), 403

    @app.route("/api/users/<username>", methods=["GET"])
    def get_user(username):
        user = accounts.find_account(username)
        if user:
            return jsonify(user), 200
        else:
            return jsonify({"error": "User not found"}), 404

    @app.route("/api/boards", methods=["GET"])
    def access_boards():
        all_boards = boards.retrieveBoards()
        return jsonify(all_boards), 200

    @app.route("/api/boards", methods=["POST"])
    @with_valid_session
    def create_boards():
        title = request.json.get("title")
        username = get_session_username(request)
        # creatorID = request.json.get('creatorID')
        board_id = boards.createBoard(title, username)
        return jsonify({"id": board_id}), 201

    @app.route("/api/boards/<boardId>", methods=["GET"])
    def get_board(boardId):
        board = boards.retrieveBoard(boardId)
        if board:
            return jsonify(board), 200
        else:
            return jsonify({"error": "Board not found"}), 404

    @app.route("/api/boards/<boardId>", methods=["DELETE"])
    @with_valid_session
    def delete_board(boardId):
        board = boards.retrieveBoard(boardId)
        if board is None:
            return jsonify({"error": f"Not board with ID: {boardId}"}), client.NOT_FOUND

        if board.get("board", {}).get("creatorID", "") != get_session_username(request):
            return (
                jsonify({"error": "You do not have permission to delete this board"}),
                client.FORBIDDEN,
            )

        boards.deleteBoard(boardId)  # Adjust this to match your actual deletion method
        return "", client.NO_CONTENT
        # if success:
        #     return jsonify({"success": "Board successfully deleted"}), client.OK
        # else:
        #     return jsonify({"error": "Failed to delete board or board not found"}), client.NOT_FOUND

    @socketio.on("connect")
    def handle_connect():
        print("Client connected:", request.sid)
        emit("con", {"data": f"id: {request.sid} is connected"})

    @socketio.on("disconnect")
    def handle_disconnect():
        print("Client disconnected:", request.sid)

    @socketio.on("join")
    def on_join(data):
        username = get_user_from_token(request.cookies.get("AUTH_TOKEN"))
        room = data["room"]
        join_room(room)
        emit("status", {"msg": f"{username} has entered the room."}, room=room)
        chats_log = chat.get_chats(room)
        emit("get_chat_log", {"payload": chats_log}, to=request.sid)

    @socketio.on("leave")
    def on_leave(data):
        username = get_user_from_token(request.cookies.get("AUTH_TOKEN"))
        room = data["room"]
        leave_room(room)
        emit("status", {"msg": f"{username} has left the room."}, room=room)

    @socketio.on("send_message")
    def handle_message(data):
        room = data["room"]
        user = get_user_from_token(request.cookies.get("AUTH_TOKEN"))
        if user:
            imagePath = accounts.find_account(user)["picture"]
            message = data["message"]
            res = {"message": message, "user": user, "avatar": imagePath}
            print(f"Message received in room {room}: {message} from {user}")
            emit(
                "receive_message",
                res,
                room=room,
            )
            chat.add_chat(room, message, user, imagePath)

    def get_user_from_token(token):
        if token:
            try:
                decoded = jwt.decode(token, "SECRET_KET", algorithms=["HS256"])
                return decoded.get("uid")
            except jwt.ExpiredSignatureError:
                return None
        return None

    return app
