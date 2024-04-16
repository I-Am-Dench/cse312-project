from flask_socketio import SocketIO, emit
from flask import Flask, request
import jwt

# Assuming you have an existing Flask app instance
from . import create_app

app = create_app()
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    print('Client connected:', request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected:', request.sid)

@socketio.on('send_message')
def handle_message(data):
    user = get_user_from_token(request.cookies.get('AUTH_TOKEN'))
    if user:
        message = data['message']
        print(f'Message received: {message} from {user}')
        emit('receive_message', {'message': message, 'user': user}, broadcast=True)

def get_user_from_token(token):
    if token:
        try:
            decoded = jwt.decode(token, "SECRET_KET", algorithms=["HS256"])
            return decoded.get("uid")
        except jwt.ExpiredSignatureError:
            return None
    return None

if __name__ == '__main__':
    socketio.run(app)
