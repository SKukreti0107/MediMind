import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialVariants = {
    hover: { y: -5, color: '#64ffda' },
    tap: { scale: 0.95 }
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <motion.div 
          className="footer-logo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span>MediMind</span>
          <p>A RAG-Driven LLM for your Medical Needs. </p>
        </motion.div>
        
        <div className="footer-links">
          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/documentation">Documentation</Link></li>
              <li><Link to="/api">API</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Nishant Mishra, Shubham Kukreti </p>
        
        <div className="social-links">
          <motion.a 
            href="#" 
            variants={socialVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaGithub />
          </motion.a>
          <motion.a 
            href="#" 
            variants={socialVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaTwitter />
          </motion.a>
          <motion.a 
            href="#" 
            variants={socialVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaLinkedin />
          </motion.a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;