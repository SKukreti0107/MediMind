# MediMind - AI-Powered Medical Assistant

MediMind is a comprehensive medical AI chat application that provides symptom analysis, diagnosis guidance, and treatment recommendations. The application features user authentication, session management, and personalized chat history.

CHECK OUT THE WEBSITE : https://medi-mind-sooty.vercel.app/

## Features

- **User Authentication**: Secure registration and login system
- **Personalized Chat History**: All conversations are saved and organized by user
- **Chat Management**: Create, rename, and continue conversations
- **Medical AI Assistance**: Get AI-powered medical guidance based on symptoms
- **RAG (Retrieval-Augmented Generation)**: Enhanced responses with relevant medical information
- **Responsive Design**: Works on all device sizes

## Tech Stack

### Backend
- **Flask API**: Serverless functions deployed on Vercel
- **LangChain**: Orchestration of LLM processes
- **MongoDB Atlas**: User, chat, and message storage
- **Pinecone**: Vector database for medical knowledge
- **JWT Authentication**: Secure user sessions

### Frontend
- **React**: Frontend component library
- **Vite**: Build tool
- **Chakra UI**: UI component framework
- **React Router**: Navigation and routing
- **Framer Motion**: Animations and transitions

## Setup and Installation

### Prerequisites

- Node.js and npm
- Python 3.8 or newer
- MongoDB Atlas account
- Pinecone account
- Gemini API key (for LLM access)

### Backend Setup

1. Navigate to the API server directory:
   ```
   cd api\ server/medi_mind_api/
   ```

2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

5. Update the `.env` file with your credentials:
   - MongoDB URI
   - JWT Secret
   - Pinecone API key
   - Gemini API key

6. Run the development server:
   ```
   python wsgi.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd MP\ front/medi_mind/
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the API URL:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. Run the development server:
   ```
   npm run dev
   ```

## Deployment

### Backend Deployment (Vercel)

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Navigate to the API server directory:
   ```
   cd api\ server/medi_mind_api/
   ```

3. Deploy to Vercel:
   ```
   vercel
   ```

4. Configure environment variables in the Vercel dashboard:
   - MONGODB_URI
   - JWT_SECRET
   - PINECONE_API_KEY
   - GEMINI_API_KEY

### Frontend Deployment (Vercel)

1. Navigate to the frontend directory:
   ```
   cd MP\ front/medi_mind/
   ```

2. Deploy to Vercel:
   ```
   vercel
   ```

3. Set the environment variable in the Vercel dashboard:
   - VITE_API_BASE_URL=https://your-api-url.vercel.app

## Project Structure

- `api server/medi_mind_api/`: Backend Flask API with LangChain integration
  - `api/`: Main API code
    - `database/`: MongoDB models and configuration
    - `auth.py`: Authentication utilities
    - `chat_routes.py`: Chat endpoints
    - `auth_routes.py`: Authentication endpoints
    - `index.py`: Main Flask application
  - `tests/`: API tests
  - `vercel.json`: Vercel deployment configuration

- `MP front/medi_mind/`: React frontend
  - `src/`: Source code
    - `components/`: React components
      - `Auth/`: Login and registration components
      - `Chat/`: Chat interface
      - `Sidebar/`: Chat history sidebar
    - `context/`: React context providers
    - `services/`: API service layer

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

- Team MediMind
