import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';
import Layout from './components/Layout/Layout';
import HomePage from './components/Home/HomePage';
import ChatInterface from './components/Chat/ChatInterface';
import AboutPage from './components/About/AboutPage';
import Documentation from './components/Documentation/Documentation';
import PrivacyPolicy from './components/Privacy/PrivacyPolicy';
import LoginPage from './components/Auth/LoginPage'; // Import Login page
import RegisterPage from './components/Auth/RegisterPage'; // Import Register page
import ProtectedRoute from './components/Auth/ProtectedRoute'; // Import ProtectedRoute
import Sidebar from './components/Sidebar/Sidebar'; // Import Sidebar
import { useState } from 'react'; // Import useState

function App() {
  // State to manage the active chat ID
  const [activeChatId, setActiveChatId] = useState(null);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Protected Routes */}
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}> {/* Adjust height based on Layout */} 
                  <Sidebar 
                    activeChatId={activeChatId} 
                    onSelectChat={setActiveChatId} 
                  />
                  <ChatInterface 
                    activeChatId={activeChatId} 
                  />
                </div>
              </ProtectedRoute>
            }
          />
          {/* Add ProtectedRoute wrapper to other private pages as needed */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
