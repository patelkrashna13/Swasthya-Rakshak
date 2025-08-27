import { motion } from 'framer-motion';
import CountUp from '../common/CountUp';

const stats = [
  { 
    value: 5000, 
    suffix: '+', 
    title: 'Healthcare Providers', 
    description: 'Doctors and facilities using our platform',
    color: 'text-primary-600 dark:text-primary-400' 
  },
  { 
    value: 1.2, 
    suffix: 'M+', 
    title: 'Patient Consultations', 
    description: 'Monthly telemedicine appointments',
    color: 'text-secondary-600 dark:text-secondary-400' 
  },
  { 
    value: 98, 
    suffix: '%', 
    title: 'Satisfaction Rate', 
    description: 'From both patients and providers',
    color: 'text-accent-600 dark:text-accent-400' 
  },
  { 
    value: 30, 
    suffix: '%', 
    title: 'Efficiency Improved', 
    description: 'In hospital resource management',
    color: 'text-success-600 dark:text-success-400' 
  },
];

const StatsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-primary-300/10 dark:bg-primary-600/5 blur-3xl"></div>
        <div className="absolute top-20 -left-20 w-60 h-60 rounded-full bg-secondary-300/10 dark:bg-secondary-600/5 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Making a Real Impact
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our platform is transforming healthcare delivery across India with measurable results
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center glass-card p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <h3 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${stat.color}`}>
                <CountUp end={stat.value} duration={2.5} />
                {stat.suffix}
              </h3>
              <p className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {stat.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;