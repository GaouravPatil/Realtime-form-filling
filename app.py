from flask import Flask, send_from_directory
from flask_cors import CORS
from models import db
from routes import api
import os

app = Flask(__name__, static_folder='static')
CORS(app)

# SQLite for localhost convenience, easily switchable to MySQL/Postgres via URI
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///form_data.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
app.register_blueprint(api, url_prefix='/api')

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("Database initialized.")
    app.run(host=0.0.0.0, debug=true, port=5000)
