

from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
import sys
import os


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'lib')))

from db import get_db
from .auth import token_required
from .database.models import chat_schema, message_schema, serialize_doc
from .rag_setup import rag_chain 
from langchain_core.messages import HumanMessage, AIMessage 

chat_bp = Blueprint('chat_bp', __name__)


@chat_bp.route('/chats', methods=['GET'])
@token_required
def get_chats():
    current_user_id = getattr(request, 'current_user_id', None)
    if not current_user_id:
        return jsonify({'message': 'Authentication required'}), 401

    try:
        db = get_db()
        chats_collection = db.chats
        user_chats = list(chats_collection.find({'user_id': ObjectId(current_user_id)}).sort('updated_at', -1))
        return jsonify([serialize_doc(chat) for chat in user_chats]), 200
    except Exception as e:
        return jsonify({'message': 'Failed to retrieve chats', 'error': str(e)}), 500


@chat_bp.route('/chats', methods=['POST'])
@token_required
def create_chat():
    current_user_id = getattr(request, 'current_user_id', None)
    if not current_user_id:
        return jsonify({'message': 'Authentication required'}), 401

    try:
        db = get_db()
        chats_collection = db.chats
        new_chat_doc = chat_schema(user_id=current_user_id)
        result = chats_collection.insert_one(new_chat_doc)
        
        created_chat = chats_collection.find_one({'_id': result.inserted_id})
        return jsonify(serialize_doc(created_chat)), 201
    except Exception as e:
        return jsonify({'message': 'Failed to create chat', 'error': str(e)}), 500


@chat_bp.route('/chats/<chat_id>', methods=['PATCH'])
@token_required
def rename_chat(chat_id):
    current_user_id = getattr(request, 'current_user_id', None)
    if not current_user_id:
        return jsonify({'message': 'Authentication required'}), 401

    data = request.get_json()
    new_title = data.get('title')
    if not new_title:
        return jsonify({'message': 'New title is required'}), 400

    try:
        db = get_db()
        chats_collection = db.chats
        result = chats_collection.update_one(
            {'_id': ObjectId(chat_id), 'user_id': ObjectId(current_user_id)}, 
            {'$set': {'title': new_title, 'updated_at': datetime.utcnow()}}
        )
        if result.matched_count == 0:
            return jsonify({'message': 'Chat not found or user not authorized'}), 404
        if result.modified_count == 0:
             return jsonify({'message': 'Chat title was not updated (possibly same title)'}), 200 

        updated_chat = chats_collection.find_one({'_id': ObjectId(chat_id)})
        return jsonify(serialize_doc(updated_chat)), 200
    except Exception as e:
        return jsonify({'message': 'Failed to rename chat', 'error': str(e)}), 500


@chat_bp.route('/chats/<chat_id>/messages', methods=['GET'])
@token_required
def get_messages(chat_id):
    current_user_id = getattr(request, 'current_user_id', None)
    if not current_user_id:
        return jsonify({'message': 'Authentication required'}), 401

    try:
        db = get_db()
        
        chat = db.chats.find_one({'_id': ObjectId(chat_id), 'user_id': ObjectId(current_user_id)})
        if not chat:
            return jsonify({'message': 'Chat not found or user not authorized'}), 404

        messages_collection = db.messages
        chat_messages = list(messages_collection.find({'chat_id': ObjectId(chat_id)}).sort('timestamp', 1))
        return jsonify([serialize_doc(msg) for msg in chat_messages]), 200
    except Exception as e:
         return jsonify({'message': 'Failed to retrieve messages', 'error': str(e)}), 500


@chat_bp.route('/chats/<chat_id>/messages', methods=['POST'])
@token_required
def send_message(chat_id):
    current_user_id = getattr(request, 'current_user_id', None)
    if not current_user_id:
        return jsonify({'message': 'Authentication required'}), 401

    data = request.get_json()
    user_content = data.get('content')
    if not user_content:
        return jsonify({'message': 'Message content is required'}), 400

    try:
        db = get_db()
        
        chat = db.chats.find_one({'_id': ObjectId(chat_id), 'user_id': ObjectId(current_user_id)})
        if not chat:
            return jsonify({'message': 'Chat not found or user not authorized'}), 404

        messages_collection = db.messages
 
        

        
        chat_messages_cursor = messages_collection.find(
            {'chat_id': ObjectId(chat_id)}
        ).sort('timestamp', 1) 
        
        
        current_chat_history = []
        for msg in chat_messages_cursor:
            if msg['role'] == 'user':
                current_chat_history.append(HumanMessage(content=msg['content']))
            elif msg['role'] == 'assistant':
                current_chat_history.append(AIMessage(content=msg['content']))

        
        response = rag_chain.invoke({"input": user_content, "chat_history": current_chat_history})
        assistant_content = response.get('answer', 'Sorry, I could not process that.')

        

        
        user_message_doc = message_schema(chat_id, current_user_id, 'user', user_content)
        messages_collection.insert_one(user_message_doc)

        
        assistant_message_doc = message_schema(chat_id, current_user_id, 'assistant', assistant_content)
        messages_collection.insert_one(assistant_message_doc)

        
        db.chats.update_one({'_id': ObjectId(chat_id)}, {'$set': {'updated_at': datetime.utcnow()}})

        
        
        
        if not current_chat_history and chat.get('title') == "New Chat":
            
            
            auto_title = user_content[:50] + ('...' if len(user_content) > 50 else '')
            db.chats.update_one({'_id': ObjectId(chat_id)}, {'$set': {'title': auto_title}})

        
        return jsonify(serialize_doc(assistant_message_doc)), 201 

    except Exception as e:
        return jsonify({'message': 'Failed to send message', 'error': str(e)}), 500