from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo


class LoginForm(FlaskForm):
    email = StringField('Логин', validators=[DataRequired()])
    password = PasswordField('Пароль', validators=[DataRequired()])
    submit = SubmitField('ВОЙТИ', render_kw={"class": "simple-btn"})


class RegistrationForm(FlaskForm):
    email = StringField('Логин', validators=[DataRequired()])
    password = PasswordField('Пароль', validators=[DataRequired(), EqualTo('confirm_password')])
    confirm_password = PasswordField('Повторите пароль', validators=[DataRequired()])
    submit = SubmitField('Зарегистрироваться', render_kw={"class": "simple-btn"})