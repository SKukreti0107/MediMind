import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBrain, FaSearch, FaUserMd, FaBookMedical } from 'react-icons/fa';
import { RiRobot2Fill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  const linkVariants = {
    hover: { scale: 1.1, color: '#64ffda' },
    tap: { scale: 0.95 }
  };

  return (
    <header className="navbar-container">
      <div className="navbar-logo">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="logo-container"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaBrain className="logo-icon" />
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            MediMind
          </motion.span>
        </motion.div>
      </div>

      {/* Mobile menu button */}
      <motion.button
        className="mobile-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
      >
        <div className={`hamburger ${isOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </motion.button>

      {/* Navigation links */}
      <motion.nav
        className={`navbar-links ${isOpen ? 'open' : ''}`}
        variants={navVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
      >
        <ul>
          <li>
            <motion.a 
              href="#dashboard" 
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <RiRobot2Fill />
              <span>LLM Chat</span>
            </motion.a>
          </li>
          <li>
            <motion.a 
              href="#symptoms" 
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaSearch />
              <span>Symptom Checker</span>
            </motion.a>
          </li>
          <li>
            <motion.a 
              href="#guidelines" 
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaBookMedical />
              <span>Clinical Guidelines</span>
            </motion.a>
          </li>
          <li>
            <motion.a 
              href="#profile" 
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaUserMd />
              <span>Profile</span>
            </motion.a>
          </li>
        </ul>
      </motion.nav>
    </header>
  );
};

export default Navbar;