import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute right-0 top-0 h-full w-full transform translate-x-1/3" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="400" r="400" fill="white" fillOpacity="0.05" />
          <circle cx="400" cy="400" r="300" fill="white" fillOpacity="0.05" />
          <circle cx="400" cy="400" r="200" fill="white" fillOpacity="0.05" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to Transform Your Healthcare Services?
          </motion.h2>
          
          <motion.p 
            className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of healthcare providers who are improving patient outcomes and operational efficiency with स्वास्थ्य रक्षक's innovative platform.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              to="/"
              className="btn-accent flex items-center justify-center"
            >
              Schedule a Demo
              <ArrowRight size={16} className="ml-2" />
            </Link>
            
            <Link 
              to="/"
              className="bg-white text-primary-700 hover:bg-primary-50 py-2 px-4 rounded-md transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Contact Sales
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;