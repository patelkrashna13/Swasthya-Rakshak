import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations';
import HeartAnimation from '../common/HeartAnimation';

const HeroSection = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language].hero;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="relative min-h-screen pt-20 overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-300/10 dark:bg-primary-600/5 blur-3xl"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 rounded-full bg-secondary-300/10 dark:bg-secondary-600/5 blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-accent-300/10 dark:bg-accent-600/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 md:pt-24 pb-24 relative z-10">
        <motion.div 
          className="flex flex-col lg:flex-row items-center justify-between gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left side - Text content */}
          <motion.div className="flex-1 max-w-2xl" variants={itemVariants}>
            <motion.div 
              className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Heart size={16} className="mr-2" />
              <span>{t.tagline}</span>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white mb-6"
              variants={itemVariants}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">
                {t.subtitle}
              </span>
              <br />
              <span>{t.title}</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
              variants={itemVariants}
            >
              {t.description}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <Link to="/telemedicine" className="btn-primary">
                {t.exploreTelemedicine}
                <ArrowRight size={16} className="ml-2 inline" />
              </Link>
              <Link to="/hospital-management" className="bg-transparent border border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 py-2 px-4 rounded-md transition-colors duration-300 shadow-sm hover:shadow-md">
                {t.hospitalSolutions}
              </Link>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex items-center space-x-4"
              variants={itemVariants}
            >
              <div className="flex -space-x-2">
                <img className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900" src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=100" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900" src="https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=100" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900" src="https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=100" alt="User" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">500+</span> {t.trustedBy}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right side - 3D Heart Animation */}
          <motion.div 
            className="flex-1 flex justify-center items-center"
            variants={itemVariants}
          >
            <div className="relative w-full max-w-md aspect-square">
              <HeartAnimation />
              
              {/* Floating feature cards */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="animate-float absolute -top-4 -left-4 glass-card p-4 rounded-lg max-w-[180px]"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 10V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M3 10H21V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V10Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm">{t.features.secureData.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{t.features.secureData.description}</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="animate-float absolute top-1/4 -right-4 glass-card p-4 rounded-lg max-w-[180px]"
              >
                <div className="text-secondary-600 dark:text-secondary-400 mb-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm">{t.features.aiDiagnostics.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{t.features.aiDiagnostics.description}</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
                className="animate-float absolute -bottom-4 left-1/4 glass-card p-4 rounded-lg max-w-[180px]"
              >
                <div className="text-accent-600 dark:text-accent-400 mb-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 14V8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white text-sm">{t.features.remoteMonitoring.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">{t.features.remoteMonitoring.description}</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;