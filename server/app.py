# app.py
from flask import Flask, request, jsonify
from comment import create_comment, delete_comment
from server.database import database

app = Flask(__name__)

@app.route('/api/boards/<board_id>/comments', methods=['POST'])
def add_comment(board_id):
    user_id = request.json['user_id']
    content = request.json['content']
    comment_id = create_comment(board_id, user_id, content)
    return jsonify({"comment_id": str(comment_id)}), 201

@app.route('/api/boards/<board_id>/comments/<comment_id>', methods=['DELETE'])
def remove_comment(board_id, comment_id):
    user_id = request.json['user_id']  # In a real app, the user ID should be retrieved from the session or token
    success = delete_comment(comment_id, user_id)
    if success:
        return jsonify({"success": True}), 204
    else:
        return jsonify({"error": "Comment could not be deleted"}), 403



@app.route('/api/users/<username>', methods=['GET'])
def get_user(username):
    user = database.getUserByUsername(username)
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


if __name__ == '__main__':
    app.run(debug=True)
