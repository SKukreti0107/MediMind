import { motion } from 'framer-motion';
import styles from './Documentation.module.css';

const Documentation = () => {
  return (
    <motion.div
      className={styles['documentation-page']}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.container}>
        <motion.h1
          className={styles['page-title']}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Technical Documentation
        </motion.h1>

        <motion.section
          className={styles['tech-stack']}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2>Tech Stack</h2>
          <div className={styles['tech-grid']}>
            <motion.div
              className={styles['tech-card']}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
            >
              <h3>Frontend</h3>
              <ul>
                <li>React.js - UI Library</li>
                <li>Framer Motion - Animations</li>
                <li>Vite - Build Tool</li>
                <li>CSS Modules - Styling</li>
              </ul>
            </motion.div>

            <motion.div
              className={styles['tech-card']}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
            >
              <h3>AI/ML Integration</h3>
              <ul>
                <li>LangChain - LLM Framework</li>
                <li>LangFlow - Visual Programming</li>
                <li>RAG Architecture</li>
                <li>Vector Databases</li>
              </ul>
            </motion.div>

            <motion.div
              className={styles['tech-card']}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
            >
              <h3>Development Tools</h3>
              <ul>
                <li>Git - Version Control</li>
                <li>npm - Package Manager</li>
                <li>ESLint - Code Quality</li>
                <li>VS Code - IDE</li>
              </ul>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className={styles.implementation}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2>Implementation Details</h2>
          <div className={styles['implementation-content']}>
            <motion.div
              className={styles['implementation-card']}
              whileHover={{ scale: 1.02 }}
            >
              <h3>RAG-Driven Architecture</h3>
              <p>
                MediMind utilizes Retrieval-Augmented Generation (RAG) to provide accurate
                and context-aware medical information. This approach combines the power
                of large language models with specialized medical knowledge bases.
              </p>
            </motion.div>

            <motion.div
              className={styles['implementation-card']}
              whileHover={{ scale: 1.02 }}
            >
              <h3>Interactive UI</h3>
              <p>
                The user interface is built with React.js and enhanced with Framer Motion
                animations to provide a smooth and engaging user experience. The design
                follows modern web standards and accessibility guidelines.
              </p>
            </motion.div>

            <motion.div
              className={styles['implementation-card']}
              whileHover={{ scale: 1.02 }}
            >
              <h3>Medical Knowledge Integration</h3>
              <p>
                LangChain is used to integrate and process medical knowledge bases,
                ensuring that the system provides reliable and up-to-date medical
                information. The platform includes extensive medical references and
                guidelines.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className={styles['system-requirements']}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2>System Requirements</h2>
          <div className={styles['requirements-list']}>
            <ul>
              <li>Node.js 16.x or higher</li>
              <li>Modern web browser with JavaScript enabled</li>
              <li>Minimum 4GB RAM recommended</li>
              <li>Internet connection for API access</li>
            </ul>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default Documentation;