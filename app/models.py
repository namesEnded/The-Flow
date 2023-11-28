import uuid
from datetime import datetime

from flask_login import UserMixin
from sqlalchemy import UUID
from werkzeug.security import check_password_hash

from database import db

roles_users = db.Table('roles_users',
                       db.Column('user_uuid', UUID(as_uuid=True), db.ForeignKey('users.uuid')),
                       db.Column('role_id', db.Integer(), db.ForeignKey('roles.id')))


class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    @classmethod
    def find_role_by_name(cls, name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def get_default(cls):
        return cls.query.filter_by(name="User").first()

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '< Role id: {}>'.format(self.id)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
        }


class User(db.Model, UserMixin):
    __tablename__ = 'users'
    uuid = db.Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, primary_key=True)

    # User information
    is_active = db.Column('is_active', db.Boolean(), nullable=False, server_default='1')
    created_datetime = db.Column(db.DateTime, default=datetime.utcnow)
    username = db.Column(db.String(25), nullable=False, server_default='', unique=True)
    password_hash = db.Column(db.String(300), nullable=False, server_default='')

    # Define the relationship
    roles = db.relationship('Role', secondary=roles_users, backref='roled')

    @property
    def id(self):
        return self.uuid

    @id.setter
    def id(self, value):
        self.uuid = value

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __init__(self, password_hash, username, role):
        self.password_hash = password_hash
        self.username = username
        self.roles.append(role)

    def __repr__(self):
        return '< User:email: email {}>'.format(self.email)

    @staticmethod
    def get_all_users():
        users = User.query.all()
        return [user.serialize() for user in users]

    @classmethod
    def find_user_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_user_by_uuid(cls, user_uuid):
        return cls.query.filter_by(uuid=user_uuid).first()

    def get_id(self):
        return self.uuid

    def serialize(self):
        return {
            'uuid': self.uuid,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name
        }