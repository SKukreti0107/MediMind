

from flask import Blueprint, request, jsonify, make_response
from bson import ObjectId
import sys
import os


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'lib')))

from db import get_db
from .auth import hash_password, check_password, create_jwt_token
from .database.models import user_schema, serialize_doc

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400

    email = data['email']
    password = data['password']

    try:
        db = get_db()
        users_collection = db.users

        
        if users_collection.find_one({"email": email}):
            return jsonify({'message': 'User already exists'}), 409

        
        hashed_password = hash_password(password)
        new_user = user_schema(email, hashed_password)

        
        result = users_collection.insert_one(new_user)

        
        
        
        
        

        return jsonify({'message': 'User registered successfully', 'user_id': str(result.inserted_id)}), 201

    except Exception as e:
        return jsonify({'message': 'Registration failed', 'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400

    email = data['email']
    password = data['password']

    try:
        db = get_db()
        users_collection = db.users

        user = users_collection.find_one({"email": email})

        if not user or not check_password(user['password_hash'], password):
            return jsonify({'message': 'Invalid credentials'}), 401

        
        token = create_jwt_token(user['_id'])

        response = make_response(jsonify({'message': 'Login successful', 'user_id': str(user['_id'])}), 200)
        
        response.set_cookie(
            'token',
            token,
            httponly=True,
            
            samesite='Lax' 
        )
        return response

    except Exception as e:
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    
    response = make_response(jsonify({'message': 'Logout successful'}), 200)
    response.set_cookie('token', '', expires=0, httponly=True, secure=True, samesite='Lax') 
    return response