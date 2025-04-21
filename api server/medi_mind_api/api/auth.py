

import os
import jwt
from datetime import datetime, timedelta, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from flask import request, jsonify


JWT_SECRET = os.getenv('JWT_SECRET', 'default-secret-key') 
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_MINUTES = 30

def hash_password(password):
    """Hashes a password using Werkzeug's security helpers."""
    return generate_password_hash(password)

def check_password(hashed_password, password):
    """Checks a password against its hashed version."""
    return check_password_hash(hashed_password, password)

def create_jwt_token(user_id):
    """Creates a JWT token for a given user ID."""
    payload = {
        'user_id': str(user_id), 
        'exp': datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRATION_MINUTES),
        'iat': datetime.now(timezone.utc)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def decode_jwt_token(token):
    """Decodes a JWT token and returns the payload or None if invalid/expired."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None 
    except jwt.InvalidTokenError:
        return None 

def token_required(f):
    """Decorator to protect routes that require authentication."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        payload = decode_jwt_token(token)
        if payload is None:
            return jsonify({'message': 'Token is invalid or expired!'}), 401

        
        
        
        request.current_user_id = payload['user_id'] 

        return f(*args, **kwargs)
    return decorated_function