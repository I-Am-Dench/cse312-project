from flask import Flask

def create_app(test_config=None):
    app = Flask(__name__)
    
    @app.route('/')
    def serve():
        return "<h1>Hello, world!</h1>", 200
    
    return app