<!-- File: projectrequiremnt.md -->

# Project Requirements

A comprehensive outline of the functional requirements, technology stack, data schema, and deployment considerations for the Flask / LangChain RAG chat application with user authentication, session management, and chat‑history sidebar.

---

## 1. Overview

This document specifies the requirements for extending our Flask + LangChain retrieval‑augmented generation (RAG) chat app to support:

- **User registration, login & session management**  
- **Per‑user chat history with clickable titles**  
- **“New Chat” functionality**  
- **Sidebar UI listing past chats**  
- **Secure, serverless deployment on Vercel**  

All server‑side logic runs in Flask‑style handlers deployed as Vercel Serverless Functions. Data is stored in MongoDB Atlas and Pinecone; frontend is built with React + Vite.

---

## 2. Technology Stack

- **Frontend**  
  - **Framework**: React  
  - **Build Tool**: Vite  
  - **State Management**: your choice (e.g., Context API, Redux)  
  - **HTTP Client**: `fetch` or axios

- **Backend**  
  - **API Layer**: Flask endpoints, refactored as Vercel Serverless Functions  
  - **LLM Orchestration**: LangChain  
  - **Vector DB**: Pinecone  
  - **Primary Database**: MongoDB Atlas  
  - **Authentication**: JWT via HTTP‑only cookies

- **Deployment**  
  - **Platform**: Vercel (frontend + serverless functions)  
  - **CI/CD**: GitHub → Vercel integration  
  - **Environment Variables**: Vercel Secrets for MongoDB URI, Pinecone API key, JWT secret

---

## 3. Functional Requirements

| Requirement ID | Description                           | User Story                                                                                                                                         | Expected Behavior / Outcome                                                                                                                                                                                                                                                    |
|---------------:|---------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **FR001**      | User Registration & Login             | As a visitor, I want to sign up and log in to the app so that my chats can be saved under my account.                                              | Implement `POST /api/register` and `POST /api/login` as Vercel Serverless Functions. Store users in MongoDB Atlas with securely hashed passwords. On login, issue an HTTP‑only JWT cookie.                                                                                        |
| **FR002**      | Session Management                    | As an authenticated user, I want my login state to persist across requests so I don’t have to re‑enter credentials on each page.                    | Verify JWT in middleware on every serverless function. Enforce token expiry (e.g. 30 min idle) and optional refresh logic. Protected endpoints require a valid token.                                                                                                         |
| **FR003**      | Chat Session Persistence              | As a user, I want every chat I start to be saved so I can revisit it later.                                                                         | `POST /api/chats` creates a new `chat_id` in MongoDB Atlas (`chats` collection). Each message sent/received is stored in `messages` collection with fields `(message_id, chat_id, user_id, role, content, timestamp)`.                                                             |
| **FR004**      | Sidebar Chat List                     | As a user, I want to see a sidebar listing all my past chats (by title) so I can pick one to continue or review.                                   | Frontend calls `GET /api/chats` to fetch all chats for the authenticated `user_id`. Sidebar renders clickable titles; selecting one loads its message history.                                                                                                                    |
| **FR005**      | Chat Titling                          | As a user, I want each chat to have a meaningful title (auto‑generated or custom) so I can recognize it later.                                       | On first message, a serverless function auto‑generates a title (e.g., summary of initial prompt) and PATCHes the `chats` document. Users can rename via `PATCH /api/chats/<chat_id>`; updates reflected immediately in sidebar.                                                     |
| **FR006**      | Load & Render Previous Chat           | As a user, I want to click a chat title in the sidebar and see the full message history in the main window.                                        | Selecting a chat triggers `GET /api/chats/<chat_id>/messages`, returning all messages for that chat. Frontend re‑renders the conversation, preserving roles, timestamps, and enabling continuation.                                                                               |
| **FR007**      | New Chat Creation                     | As a user, I want a “New Chat” button so I can start a fresh conversation without losing context of others.                                         | “New Chat” invokes `POST /api/chats`, creating a blank chat in MongoDB Atlas. Sidebar adds an entry “New Chat” which updates to an auto‑generated title once the first message is sent.                                                                                           |
| **FR008**      | Access Control                        | As a user, I want to ensure I only see and interact with my own chats, not others’.                                                                | All endpoints authenticate the JWT’s `user_id` and filter queries accordingly. Unauthorized access to other `chat_id`s returns HTTP 403 Forbidden.                                                                                                                               |
| **FR009**      | Logout & Session Expiry               | As a user, I want to log out when I’m done and have my session expire automatically after inactivity.                                               | `POST /api/logout` clears the JWT cookie. JWTs include an expiry claim; expired tokens are rejected and users are redirected to login.                                                                                                                                          |
| **FR010**      | Frontend Integration & Responsiveness | As a user, I want the sidebar and chat window to update dynamically without full page reload for seamless UX.                                       | Frontend (React + Vite) uses `fetch`/AJAX to call `/api/*`. Sidebar and main pane update in real time on chat creation, renaming, deletion. Responsive layout for desktop/mobile.                                                                                              |
| **FR011**      | Database Schema & Indexing            | As a developer, I want a clear MongoDB Atlas schema with proper indexes for performance.                                                            | Define collections in MongoDB Atlas:  
  - **users**: `user_id`, `email`, `password_hash`, timestamps  
  - **chats**: `chat_id`, `user_id`, `title`, `created_at`, `updated_at`  
  - **messages**: `message_id`, `chat_id`, `user_id`, `role`, `content`, `timestamp`  
  Ensure indexes on `user_id` in `chats` and `(chat_id, timestamp)` in `messages`.                                                                                             |
| **FR012**      | Vector Retrieval Integration          | As a user, I want relevant context fetched automatically for my queries so the LLM can give accurate answers.                                       | Backend uses LangChain + Pinecone:  
  - On new chat or follow‑up, embed user messages into Pinecone index  
  - Retrieve top‑K similar chunks from policy or knowledge docs  
  - Inject retrieved context into the LangChain prompt template before calling the LLM                                                                                                                |
| **FR013**      | Serverless Compatibility              | As a developer, I want all backend logic to run in Vercel Serverless Functions so the project deploys reliably.                                     | Refactor Flask routes into Vercel Python Functions. Reuse a global Mongo client for connection pooling. Keep cold‑start time minimal. Respect Vercel execution limits (max 10 sec).                                                                                    |

---

## 4. API Endpoint Summary

| Method | Path                                  | Description                                  |
|-------:|---------------------------------------|----------------------------------------------|
| POST   | `/api/register`                       | Register new user                           |
| POST   | `/api/login`                          | Authenticate user & set JWT cookie          |
| POST   | `/api/logout`                         | Clear JWT cookie                            |
| GET    | `/api/chats`                          | List all chats for current user             |
| POST   | `/api/chats`                          | Create a new chat                           |
| PATCH  | `/api/chats/<chat_id>`                | Rename a chat                               |
| GET    | `/api/chats/<chat_id>/messages`       | Fetch all messages for a chat               |
| POST   | `/api/chats/<chat_id>/messages`       | Send a new message (user → LLM pipeline)    |

---

## 5. Deployment & Environment

- **Vercel Project**  
  - Frontend: deploy React + Vite as a static site  
  - Backend: each Flask handler becomes a Python Serverless Function under `/api/*`  

- **Environment Variables**  
  ```bash
  MONGODB_URI=<your MongoDB Atlas connection string>
  PINECONE_API_KEY=<your Pinecone key>
  JWT_SECRET=<strong random secret>
