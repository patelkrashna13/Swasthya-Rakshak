import { motion } from 'framer-motion';
import { Video, ActivitySquare, Building2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <Video className="h-6 w-6 text-primary-600 dark:text-primary-400" />,
    title: 'Telemedicine & Virtual Care',
    description: 'Connect with healthcare providers remotely through secure video consultations, messaging, and follow-ups.',
    link: '/telemedicine',
    color: 'bg-primary-50 dark:bg-primary-900/30',
    borderColor: 'border-primary-100 dark:border-primary-800',
    hoverBg: 'hover:bg-primary-100 dark:hover:bg-primary-800/20',
  },
  {
    icon: <Building2 className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />,
    title: 'Smart Hospital Management',
    description: 'Optimize resource allocation, staff scheduling, and patient flow with intelligent management tools.',
    link: '/hospital-management',
    color: 'bg-secondary-50 dark:bg-secondary-900/30',
    borderColor: 'border-secondary-100 dark:border-secondary-800',
    hoverBg: 'hover:bg-secondary-100 dark:hover:bg-secondary-800/20',
  },
  {
    icon: <ActivitySquare className="h-6 w-6 text-accent-600 dark:text-accent-400" />,
    title: 'Health Data Analytics',
    description: 'Gain insights from health data with advanced analytics and visualization tools for better decision making.',
    link: '/analytics',
    color: 'bg-accent-50 dark:bg-accent-900/30',
    borderColor: 'border-accent-100 dark:border-accent-800',
    hoverBg: 'hover:bg-accent-100 dark:hover:bg-accent-800/20',
  },
];

const FeatureSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Core Healthcare Services
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Comprehensive solutions designed to transform healthcare delivery and improve patient outcomes
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className={`rounded-xl ${feature.color} border ${feature.borderColor} p-8 card-hover ${feature.hoverBg}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <div className="mb-5">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-5">
                {feature.description}
              </p>
              <Link
                to={feature.link}
                className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
              >
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center btn-secondary"
          >
            View All Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;