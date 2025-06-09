"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Validate required fields
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email and password are required"}), 400

    # Check if user already exists
    user_exists = User.query.filter_by(email=data['email'].lower()).first()
    if user_exists:
        return jsonify({"message": "Email already registered"}), 400

    # Create new user
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        email=data['email'].lower(),
        username=data['username'].lower(),
        password=hashed_password,
        is_active=True
    )

    db.session.add(new_user)
    try:
        db.session.commit()
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error creating user: {str(e)}"}), 500


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Validate required fields
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email and password are required"}), 400

    # Find the user
    user = User.query.filter_by(email=data['email'].lower()).first()

    # Check if user exists and password is correct
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"message": "Invalid email or password"}), 401

    # Check if user is active
    if not user.is_active:
        return jsonify({"message": "User account is not active"}), 401

    # Create access token
    access_token = create_access_token(identity=user.id)

    return jsonify({
        "message": "Logged in successfully",
        "user": user.serialize(),
        "token": access_token
    }), 200


@api.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    # Get the user's identity from the JWT
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify(user.serialize()), 200


@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    return jsonify({
        "message": f"Hello, {user.email}! This is a protected route.",
        "user_id": current_user_id
    }), 200