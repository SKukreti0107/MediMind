import { motion } from 'framer-motion';
import { FaBrain, FaSearch, FaBookMedical } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <section className="hero-section">
      <motion.div 
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="hero-title">
          <span className="gradient-text">MediMind</span>
          <br />
          <span className="subtitle">AI-Powered Medical Assistant</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="hero-description">
          A RAG-Driven LLM Platform built with LangChain & LangFlow for medical professionals.
          Integrating symptom checkers and clinical guidelines to enhance patient care.
        </motion.p>
        
        <motion.div variants={itemVariants} className="hero-cta">
          <motion.button 
            className="primary-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/chat')}
          >
            Get Started
          </motion.button>
          <motion.button 
            className="secondary-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/about')}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="hero-features"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="feature-card"
          variants={itemVariants}
          whileHover={{ y: -10, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
        >
          <div className="feature-icon">
            <FaBrain />
          </div>
          <h3>LLM Chat</h3>
          <p>Interact with our advanced medical AI to get instant insights and answers.</p>
        </motion.div>
        
        <motion.div 
          className="feature-card"
          variants={itemVariants}
          whileHover={{ y: -10, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
        >
          <div className="feature-icon">
            <FaSearch />
          </div>
          <h3>Symptom Checker</h3>
          <p>Analyze symptoms with our AI-powered diagnostic assistant.</p>
        </motion.div>
        
        <motion.div 
          className="feature-card"
          variants={itemVariants}
          whileHover={{ y: -10, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
        >
          <div className="feature-icon">
            <FaBookMedical />
          </div>
          <h3>Clinical Guidelines</h3>
          <p>Access up-to-date medical guidelines and treatment protocols.</p>
        </motion.div>
      </motion.div>
      
      <div className="hero-background">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
      </div>
    </section>
  );
};

export default Hero;