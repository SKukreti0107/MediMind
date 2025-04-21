

from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'lib')))


load_dotenv()


from .auth_routes import auth_bp
from .chat_routes import chat_bp


from .rag_setup import rag_chain, get_chat_history, add_to_chat_history 
from langchain_core.messages import HumanMessage, AIMessage 
from datetime import datetime, timedelta 

app = Flask(__name__)


CORS(app, origins=["https://medi-mind-sooty.vercel.app", "http://localhost:3000"], supports_credentials=True)




app.register_blueprint(auth_bp, url_prefix='/api/auth') 
app.register_blueprint(chat_bp, url_prefix='/api') 

@app.route('/')
def home():
    return jsonify({
        'status': 'ok',
        'message': 'MediMind API is running'
    })



if __name__ == '__main__':
    
    port = int(os.environ.get("PORT", 5000))
    
    app.run(host='0.0.0.0', port=port, debug=True) 