# app.py
from flask import Flask, request, jsonify
from comment import create_comment, delete_comment

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

if __name__ == '__main__':
    app.run(debug=True)
