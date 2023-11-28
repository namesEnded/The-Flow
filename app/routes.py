from bson import ObjectId
from flask import render_template, request, redirect, url_for, jsonify, flash, send_file
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash
from validate_email import validate_email
import re

from werkzeug.utils import secure_filename

from app import app, db
from app.ImageMongo import ImageMongo
from app.forms import LoginForm, RegistrationForm
from app.models import *
from mongo_conn import img_fs
from rembg import remove
from PIL import Image
import os
import numpy as np
import io


@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    else:
        return redirect(url_for('login'))


@app.route('/editor')
@login_required
def editor():
    return render_template('main.html')



@app.route("/edit/<file_id>")
def edit_image(file_id):
    # Получение файла из GridFS по его ObjectId
    file_object = img_fs.get(ObjectId(file_id))

    # Проверка, что файл существует
    if file_object is None:
        return "Файл не найден"
    objectIDs = ImageMongo.get_image_ids_by_user_uuid(str(current_user.uuid))
    file_path = ''
    if file_id in objectIDs:
        file_path = url_for("get_image", file_id=file_id)

    return render_template('main.html', image_url=file_path)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.find_user_by_username(form.email.data)
        if user and check_password_hash(user.password_hash, form.password.data):
            login_user(user)
            flash('Logged in successfully!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password.', 'danger')
    return render_template('login_css.html', form=form)


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        email = form.email.data
        password = form.password.data

        user = User.find_user_by_username(email)
        if not user:
            password_hash = generate_password_hash(password)
            role = Role.find_role_by_name('admin')
            new_user = User(password_hash=password_hash, username=email, role=role)

            db.session.add(new_user)
            db.session.commit()

            flash('Account created successfully! You can now log in.', 'success')
            return redirect(url_for('login'))
        else:
            flash('Email already exists. Please choose a different email.', 'danger')
    return render_template('reg.html', form=form)


@app.route('/dashboard')
@login_required
def dashboard():
    objectIDs = ImageMongo.get_image_ids_by_user_uuid(str(current_user.uuid))
    text = str(current_user.username)
    username = text.split('@')[0]
    return render_template('dashboard.html', objectIDs=objectIDs, username=username, imageCount=f"Всего изображений: {len(objectIDs)}")


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('index'))


@app.route('/api/img', methods=['POST'])
def upload_image():
    response = {
        'uploaded': False,
        'url': '/'
    }
    if request.method == 'POST' and 'upload' in request.files:
        file_obj = request.files['upload']
        try:
            suffix = file_obj.filename.rsplit('.', 1)[1]
        except IndexError:
            response = {
                'uploaded': False,
                'url': '/',
                'error': 'File type not allowed'
            }
            return jsonify(response), 422
        if suffix not in ('jpeg', 'jpg', 'png', 'gif'):
            return jsonify(response)
        try:
            filename = secure_filename(file_obj.filename)
            mongo_img = ImageMongo(file_obj, filename, str(current_user.uuid))
            file_path = url_for("edit_image", file_id=mongo_img.img_id)
            response = {
                'uploaded': True,
                'url': file_path
            }
            return jsonify(response)
        except Exception as e:
            response = {
                'uploaded': False,
                'url': '/',
                'error': str(e)
            }
            return jsonify(response), 500

    else:
        flash("Invalid file.")
        return jsonify(response), 200


@app.route('/api/img/<file_id>', methods=['DELETE'])
def delete_image(file_id):
    response = {
        'deleted': False,
        'message': 'File not found'
    }
    try:
        img = img_fs.get(ObjectId(file_id))

        # Проверка, что файл существует
        if img is None:
            return response

        # Проверка существования файла
        if img:
            img_fs.delete(ObjectId(file_id))
            response = {
                'deleted': True,
                'message': 'File deleted successfully'
            }
        else:
            return jsonify(response), 404

    except Exception as e:
        response = {
            'deleted': False,
            'message': str(e)
        }
        return jsonify(response), 500

    return jsonify(response), 200


@app.route('/api/img', methods=['DELETE'])
def delete_images():
    response = {
        'deleted': False,
        'message': 'Files not found'
    }
    try:
        ImageMongo.delete_images_by_user_uuid(str(current_user.uuid))
        response = {
            'deleted': True,
            'message': 'Files deleted successfully'
        }

    except Exception as e:
        response = {
            'deleted': False,
            'message': str(e)
        }
        return jsonify(response), 500

    return jsonify(response), 200


@app.errorhandler(413)
def request_entity_too_large(error):
    response = {
        'uploaded': False,
        'url': '/',
        'error': 'File is too large'
    }
    return jsonify(response), 413


@app.errorhandler(401)
def unauthorized(error):
    response = {
        'error': 'Unauthorized'
    }
    return jsonify(response), 401


@app.errorhandler(500)
def internal_server_error(error):
    response = {
        'error': 'Internal server error'
    }
    return jsonify(response), 500


@app.route("/api/img/<file_id>")
def get_image(file_id):
    try:
        # Получение файла из GridFS по его ObjectId
        file_object = img_fs.get(ObjectId(file_id))

        # Проверка, что файл существует
        if file_object is None:
            return "Файл не найден"

        # Установка заголовков для возврата файла в формате JPEG
        headers = {
            'Content-Type': 'image/png',
            'Content-Disposition': 'attachment; filename=' + file_object.filename
        }

        # Возврат файла с помощью Flask-функции send_file
        return send_file(file_object, as_attachment=True, mimetype='image/png', download_name=file_object.filename)
    except Exception as e:
        return str(e)


@app.route('/remove_background', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return 'No image file provided', 400
    file = request.files['image'].read()
    input_img = np.array(Image.open(io.BytesIO(file)))
    output_img = remove(input_img)
    img = Image.fromarray(output_img)
    byte_arr = io.BytesIO()
    img.save(byte_arr, format='PNG')
    byte_arr = byte_arr.getvalue()
    return send_file(io.BytesIO(byte_arr), mimetype='image/png')
