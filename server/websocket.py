from flask_socketio import SocketIO, emit, join_room, leave_room
from flask import request
import jwt

from . import create_app

app = create_app()
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    print('Client connected:', request.sid)

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected:', request.sid)

@socketio.on('join')
def on_join(data):
    username = get_user_from_token(request.cookies.get('AUTH_TOKEN'))
    room = data['room']
    join_room(room)
    emit('status', {'msg': f'{username} has entered the room.'}, room=room)

@socketio.on('leave')
def on_leave(data):
    username = get_user_from_token(request.cookies.get('AUTH_TOKEN'))
    room = data['room']
    leave_room(room)
    emit('status', {'msg': f'{username} has left the room.'}, room=room)

@socketio.on('send_message')
def handle_message(data):
    room = data['room']
    user = get_user_from_token(request.cookies.get('AUTH_TOKEN'))
    if user:
        message = data['message']
        print(f'Message received in room {room}: {message} from {user}')
        emit('receive_message', {'message': message, 'user': user}, room=room)

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
