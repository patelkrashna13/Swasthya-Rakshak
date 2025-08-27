import { motion } from 'framer-motion';
import CBCReportUploadCard from './CBCReportUploadCard';
import { BarChart3, PieChart, LineChart, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line } from 'recharts';

// Sample data for charts

const dailyData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const AnalyticsPage = () => {
  const handleExploreAnalysis = () => {
    const el = document.getElementById('cbc-analysis');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-20"
    >
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-accent-50 to-white dark:from-accent-950 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <motion.h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Health Data Analytics & Visualization
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-600 dark:text-gray-300 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Transform healthcare data into actionable insights with our powerful analytics platform, designed specifically for healthcare providers.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <button onClick={handleExploreAnalysis} className="btn-accent">Explore Analysis</button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Analytics Solutions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Turn your healthcare data into actionable insights
            </p>
          </motion.div>

          <div className="flex justify-center mb-12">
            <div id="cbc-analysis" className="glass-card p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">CBC Report Analysis</h3>
              <CBCReportUploadCard />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-8 w-8 text-accent-600 dark:text-accent-400" />,
                title: "Operational Analytics",
                description: "Track and optimize key hospital metrics like bed utilization, wait times, and resource allocation."
              },
              {
                icon: <LineChart className="h-8 w-8 text-accent-600 dark:text-accent-400" />,
                title: "Clinical Analytics",
                description: "Monitor treatment outcomes, identify patterns in patient care, and improve clinical protocols."
              },
              {
                icon: <PieChart className="h-8 w-8 text-accent-600 dark:text-accent-400" />,
                title: "Financial Analytics",
                description: "Analyze revenue cycles, identify cost-saving opportunities, and improve financial performance."
              },
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="bg-accent-100 dark:bg-accent-900/30 p-3 rounded-full w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center text-accent-600 dark:text-accent-400 font-medium hover:text-accent-700 dark:hover:text-accent-300 transition-colors duration-200"
                >
                  Learn more <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Analytics Dashboard
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Customizable dashboards that provide real-time insights into your healthcare data
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Daily Patient Visits
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={dailyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                        borderColor: '#E5E7EB',
                        borderRadius: '0.375rem'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#0EA5E9" 
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                      activeDot={{ r: 6 }} 
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Key Performance Metrics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Average Wait Time", value: "28 mins", change: "-12%", positive: true },
                  { label: "Bed Occupancy Rate", value: "84%", change: "+3%", positive: true },
                  { label: "Patient Satisfaction", value: "4.8/5", change: "+0.3", positive: true },
                  { label: "Revenue per Patient", value: "₹12,450", change: "+8%", positive: true },
                ].map((metric, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
                    <div className={`flex items-center mt-1 ${metric.positive ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400'}`}>
                      <ArrowUpRight size={14} className={`${!metric.positive && 'rotate-180'}`} />
                      <span className="text-sm font-medium ml-1">{metric.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent-600 dark:bg-accent-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to Unlock Insights From Your Healthcare Data?
            </motion.h2>
            <motion.p 
              className="text-lg text-accent-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Start making data-driven decisions to improve patient outcomes and operational efficiency.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link 
                to="/"
                className="bg-white text-accent-600 hover:bg-accent-50 py-2 px-6 rounded-md transition-colors duration-300 font-medium"
              >
                Get Started
              </Link>
              <Link 
                to="/"
                className="bg-transparent border border-white text-white hover:bg-accent-700 dark:hover:bg-accent-900 py-2 px-6 rounded-md transition-colors duration-300 font-medium"
              >
                Request Demo
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default AnalyticsPage;