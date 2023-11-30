import os
from flask import Flask, flash, request, redirect, url_for
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import timedelta
from models import db

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}  # Incluye la extensión 'webp'


api = Flask(__name__)
CORS(api, origins=["https://mi-aplicacion-mu.vercel.app"])

api.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "your_default_secret_key")
api.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URI", "sqlite:///flaskdb.db")
api.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

api.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(weeks=5200)  # 100 years
jwt = JWTManager(api)

api.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
api.config["SQLALCHEMY_ECHO"] = True

bcrypt = Bcrypt(api)
db.init_app(api)

# Configuración de Flask-Migrate
migrate = Migrate(api, db)

# Importa tus rutas después de inicializar las extensiones
from routes import *

if __name__ == '__main__':
    api.run(debug=False, port=int(os.environ.get("PORT", 5000)))
