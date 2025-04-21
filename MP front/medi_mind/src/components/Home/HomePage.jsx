import { motion } from 'framer-motion';
import Hero from './Hero';
import { AnimatedGridPattern } from '../ui/animated-grid-pattern';

const HomePage = () => {
  return (
    <motion.div
      className="home-page relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
      />
      <Hero />
      
      <motion.section 
        className="about-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="container">
          <h2 className="section-title">About MediMind</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                MediMind is a cutting-edge RAG-Driven LLM Platform designed specifically for medical professionals. 
                By leveraging the power of LangChain and LangFlow, we provide an intelligent system that assists 
                healthcare providers in making informed decisions.
              </p>
              <p>
                Our platform integrates advanced symptom checkers and up-to-date clinical guidelines, 
                offering a comprehensive solution that enhances patient care and streamlines medical workflows.
              </p>
            </div>
            <div className="about-stats">
              <motion.div 
                className="stat-card"
                whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
              >
                <h3>99%</h3>
                <p>Accuracy Rate</p>
              </motion.div>
              <motion.div 
                className="stat-card"
                whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
              >
                <h3>24/7</h3>
                <p>Availability</p>
              </motion.div>
              <motion.div 
                className="stat-card"
                whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
              >
                <h3>10K+</h3>
                <p>Medical References</p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
      
      <motion.section 
        className="workflow-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="workflow-steps">
            <motion.div 
              className="workflow-step"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="step-number">1</div>
              <h3>Input Symptoms or Queries</h3>
              <p>Enter patient symptoms or medical queries into our intuitive interface.</p>
            </motion.div>
            
            <motion.div 
              className="workflow-step"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="step-number">2</div>
              <h3>AI Analysis</h3>
              <p>Our RAG-driven LLM processes the information using vast medical knowledge.</p>
            </motion.div>
            
            <motion.div 
              className="workflow-step"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="step-number">3</div>
              <h3>Receive Insights</h3>
              <p>Get evidence-based insights, potential diagnoses, and treatment recommendations.</p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default HomePage;