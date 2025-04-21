import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import NishantImage from '../../assets/Nishant.jpeg';
import ShubhamImage from '../../assets/Shubham.png';
import VenkateshImage from '../../assets/Venkatesh.png';

const AboutPage = () => {
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

  const teamMembers = [
    {
      name: 'Nishant Mishra',
      image: NishantImage,
      role: 'Project Developer',
      github: 'http://github.com/nishantm77',
      linkedin: 'http://linkedin.com/in/nishantm14'
    },
    {
      name: 'Shubham Kukreti',
      image: ShubhamImage,
      role: 'Project Developer',
      github: 'https://github.com/SKukreti0107',
      linkedin: 'https://www.linkedin.com/in/shubh-kukreti/'
    },
    {
      name: 'Venkatesh Gauri Shankar',
      image: VenkateshImage,
      role: 'Faculty Mentor',
      github: '#',
      linkedin: '#'
    }
  ];

  return (
    <div className="about-container">
      <motion.div
        className="about-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="about-title">
          About <span className="gradient-text">MediMind</span>
        </motion.h1>

        <motion.div variants={itemVariants} className="about-description">
          <p>
            MediMind is a cutting-edge medical AI assistant platform that leverages the power of Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG) to provide accurate, context-aware medical information and assistance to healthcare professionals.
          </p>
          <p>
            Built with LangChain and LangFlow, our platform integrates advanced natural language processing capabilities with comprehensive medical knowledge bases, enabling real-time analysis of symptoms, access to clinical guidelines, and intelligent medical consultations.
          </p>
          <p>
            Our mission is to enhance the quality of patient care by providing healthcare professionals with an intelligent, reliable, and easy-to-use tool that combines the latest in AI technology with evidence-based medical knowledge.
          </p>
        </motion.div>

        <motion.h2 variants={itemVariants} className="team-title">
          Meet Our Team
        </motion.h2>

        <motion.div className="team-grid" variants={containerVariants}>
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="team-card"
              variants={itemVariants}
              whileHover={{ y: -10, boxShadow: '0 10px 25px rgba(100, 255, 218, 0.2)' }}
            >
              <div className="member-image">
                <img src={member.image} alt={member.name} />
              </div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
              <div className="member-social">
                <motion.a
                  href={member.github}
                  whileHover={{ scale: 1.1, color: '#64ffda' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaGithub />
                </motion.a>
                <motion.a
                  href={member.linkedin}
                  whileHover={{ scale: 1.1, color: '#64ffda' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaLinkedin />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutPage;