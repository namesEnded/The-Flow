# app/__init__.py
from flask import Flask
from flask_login import LoginManager

import database
from database import db
from app.models import User
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object(Config)
database.init_app(app)
migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)

from app import routes, models


@login_manager.user_loader
def load_user(user_id):
    return User.find_user_by_uuid(user_id)
