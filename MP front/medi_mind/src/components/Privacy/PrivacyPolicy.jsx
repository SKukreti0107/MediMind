import { motion } from 'framer-motion';
import styles from './PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  return (
    <motion.div
      className={styles['privacy-policy-page']}
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
          Privacy Policy
        </motion.h1>

        <motion.section
          className={styles['policy-section']}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2>Data Collection and Usage</h2>
          <div className={styles['policy-content']}>
            <motion.div
              className={styles['policy-card']}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
            >
              <h3>Information We Collect</h3>
              <p>
                MediMind collects and processes medical queries and symptoms provided by users.
                This information is used solely for the purpose of generating accurate medical
                insights and recommendations. We do not collect any personally identifiable
                information unless explicitly provided by the user.
              </p>
            </motion.div>

            <motion.div
              className={styles['policy-card']}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
            >
              <h3>Data Security</h3>
              <p>
                We implement industry-standard security measures to protect your data.
                All communications between users and our servers are encrypted using
                SSL/TLS protocols. Medical information is stored securely and accessed
                only for processing queries.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className={styles['policy-section']}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2>Usage Terms</h2>
          <div className={styles['policy-content']}>
            <motion.div
              className={styles['policy-card']}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
            >
              <h3>Medical Disclaimer</h3>
              <p>
                MediMind is designed to assist medical professionals and should not be used
                as a replacement for professional medical advice, diagnosis, or treatment.
                Always seek the advice of qualified healthcare providers with questions
                regarding medical conditions.
              </p>
            </motion.div>

            <motion.div
              className={styles['policy-card']}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
            >
              <h3>User Responsibilities</h3>
              <p>
                Users are responsible for the accuracy of the information they provide
                and must ensure they have the necessary rights and permissions to share
                any medical information through our platform.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className={styles['copyright-section']}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2>Copyright Notice</h2>
          <div className={styles['copyright-content']}>
            <motion.div
              className={styles['policy-card']}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
            >
              <p>
                © 2025 MediMind. All rights reserved. The content, design, and functionality
                of this application are protected by international copyright laws. Any
                unauthorized reproduction, distribution, or modification of this application's
                content is strictly prohibited.
              </p>
              <p>
                Medical information and knowledge bases used in this platform are properly
                licensed and attributed to their respective owners. For more information
                about licensing and attributions, please contact our support team.
              </p>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicy;