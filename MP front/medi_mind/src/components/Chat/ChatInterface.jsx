import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaRobot, FaUser, FaMicrophone, FaImage } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// Import API functions
import { getMessages, sendMessage } from '../../services/api';

// Accept activeChatId as a prop
const ChatInterface = ({ activeChatId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Renamed from isTyping for clarity
  const [error, setError] = useState(null);
  // Removed selectedImage state as image upload is not implemented with backend yet
  // const [selectedImage, setSelectedImage] = useState(null);
  // Removed displayText and typewriter effect for now, focus on core chat functionality
  // const [displayText, setDisplayText] = useState('');
  const messagesEndRef = useRef(null);
  // Removed fileInputRef as image upload is simplified
  // const fileInputRef = useRef(null);

  // Fetch messages when activeChatId changes
  useEffect(() => {
    if (activeChatId) {
      fetchChatMessages(activeChatId);
    } else {
      setMessages([]); // Clear messages if no chat is selected
    }
  }, [activeChatId]);

  const fetchChatMessages = async (chatId) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedMessages = await getMessages(chatId);
      setMessages(fetchedMessages || []);
    } catch (err) {
      setError('Failed to load messages.');
      console.error(err);
      setMessages([]); // Clear messages on error
    } finally {
      setIsLoading(false);
    }
  };

  // Format text into paragraphs (can be removed if not using typewriter)
  // const formatText = (text) => {
  //   return text.split('\n').filter(para => para.trim() !== '').map(para => para.trim());
  // };

  // Send message to API and get response
  const handleSendMessage = async (query) => {
    if (!activeChatId || !query.trim()) return;

    const userMessage = {
      _id: `temp-${Date.now()}`,
      content: query,
      role: 'user',
      timestamp: new Date().toISOString(), // Add timestamp for sorting
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const assistantMessage = await sendMessage(activeChatId, query);
      // Replace temp user message if needed, or just add assistant message
      setMessages(prev => [...prev.filter(m => m._id !== userMessage._id), userMessage, assistantMessage]);
      // Refetch messages to ensure consistency, or just add the new one
      // fetchChatMessages(activeChatId); // Option 1: Refetch all
      // Option 2: Just add the assistant message (already done above)

      // TODO: Handle potential auto-title update on the backend

    } catch (err) {
      setError('Failed to send message.');
      console.error(err);
      // Optionally remove the user message if sending failed
      setMessages(prev => prev.filter(m => m._id !== userMessage._id));
    } finally {
      setIsLoading(false);
    }
  };

  // Removed image upload handler for now
  // const handleImageUpload = (e) => { ... };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  // Message animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="chat-container"> {/* Use a different class name if needed to avoid conflicts */} 
      <div className="chat-header">
        {/* Header content can be dynamic based on activeChatId */} 
        {/* <p className="chat-subtitle">Chatting in: {activeChatId || 'Select a chat'}</p> */} 
      </div>
      
      <div className="messages-container">
        <AnimatePresence mode="wait">
          {!activeChatId ? (
            <motion.div 
              className="empty-chat"
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
            >
              <FaRobot className="empty-icon" />
              <p>Select a chat from the sidebar or start a new one.</p>
            </motion.div>
          ) : isLoading && messages.length === 0 ? (
            <motion.div 
              className="empty-chat" // Reuse styling or create a loading state style
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
            >
              <p>Loading messages...</p>
            </motion.div>
          ) : error ? (
             <motion.div 
              className="empty-chat error-message" // Add error styling
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p>{error}</p>
              <button onClick={() => fetchChatMessages(activeChatId)}>Retry</button>
            </motion.div>
          ) : messages.length === 0 && !isLoading ? (
            <motion.div 
              className="empty-chat"
              key="no-messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
            >
              <FaRobot className="empty-icon" />
              <p>Send your first message to start the conversation!</p>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message._id || `msg-${index}`} // Use message._id from DB
                className={`message ${message.role}`}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout // Add layout animation
              >
                <div className="message-avatar">
                  {message.role === 'user' ? <FaUser /> : <FaRobot />}
                </div>
                <div className="message-bubble">
                  {/* Removed image rendering for now */}
                  {/* {message.image && <img src={message.image} alt="Uploaded content" className="message-image" />} */}
                  {/* Render message content using Markdown */}
                  <ReactMarkdown
                    children={message.content}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  />
                  {/* Display timestamp if available */}
                  {message.timestamp && (
                    <span className="message-timestamp">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        {/* Add typing indicator if needed */}
        {/* {isLoading && <div className="typing-indicator">MediMind is thinking...</div>} */}
        <div ref={messagesEndRef} />
      </div>

      <div className="disclaimer-container">
        <div className="disclaimer-content">
          <p className="disclaimer-text">
            <strong>Medical Disclaimer:</strong> This AI assistant provides general information and should not replace professional medical advice. Always consult a qualified healthcare provider for medical decisions.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="chat-input-area">
        <div className="chat-input-wrapper">
          {/* Removed image upload button for now */}
          {/* <button type="button" className="input-button" onClick={() => fileInputRef.current.click()} title="Upload Image"> */}
          {/*   <FaImage /> */}
          {/* </button> */}
          {/* <input */}
          {/*   type="file" */}
          {/*   ref={fileInputRef} */}
          {/*   style={{ display: 'none' }} */}
          {/*   accept="image/*" */}
          {/*   onChange={handleImageUpload} */}
          {/* /> */}
          {/* Removed microphone button for now */}
          {/* <button type="button" className="input-button" title="Voice Input"> */}
          {/*   <FaMicrophone /> */}
          {/* </button> */} 
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={activeChatId ? "Type your message..." : "Select a chat first"}
            disabled={!activeChatId || isLoading}
          />
          <button 
            type="submit" 
            className="send-button" 
            disabled={!input.trim() || !activeChatId || isLoading}
            title="Send Message"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;