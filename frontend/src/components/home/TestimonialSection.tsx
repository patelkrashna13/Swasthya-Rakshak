import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    content: "स्वास्थ्य रक्षक has revolutionized how we deliver care to our patients. The telemedicine platform is intuitive and reliable, allowing us to reach patients in remote areas.",
    author: "Dr. Priya Sharma",
    position: "Chief Medical Officer",
    organization: "City General Hospital",
    avatar: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    content: "The analytics dashboard provides invaluable insights that have helped us optimize our resource allocation and improve patient outcomes significantly.",
    author: "Rajesh Kumar",
    position: "Hospital Administrator",
    organization: "National Health Center",
    avatar: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
  {
    content: "Implementation was seamless, and the support team was exceptional. Our staff adapted quickly, and patients love the improved experience and care coordination.",
    author: "Dr. Ananya Patel",
    position: "Telemedicine Director",
    organization: "Health Connect Network",
    avatar: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg?auto=compress&cs=tinysrgb&w=100",
  },
];

const TestimonialSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Hear from medical practitioners and administrators who have transformed their healthcare delivery
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="glass-card p-8 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              {/* Quote mark decoration */}
              <div className="absolute top-6 right-8 text-gray-200 dark:text-gray-800">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 20H7.5C6.83696 20 6.20107 19.7366 5.73223 19.2678C5.26339 18.7989 5 18.163 5 17.5V12.5C5 11.837 5.26339 11.2011 5.73223 10.7322C6.20107 10.2634 6.83696 10 7.5 10H12.5C13.163 10 13.7989 10.2634 14.2678 10.7322C14.7366 11.2011 15 11.837 15 12.5V27.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M32.5 20H27.5C26.837 20 26.2011 19.7366 25.7322 19.2678C25.2634 18.7989 25 18.163 25 17.5V12.5C25 11.837 25.2634 11.2011 25.7322 10.7322C26.2011 10.2634 26.837 10 27.5 10H32.5C33.163 10 33.7989 10.2634 34.2678 10.7322C34.7366 11.2011 35 11.837 35 12.5V27.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Rating stars */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-warning-400 fill-warning-400" />
                ))}
              </div>

              {/* Testimonial content */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 z-10 relative">
                "{testimonial.content}"
              </p>

              {/* Author info */}
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-white dark:border-gray-800"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.position}, {testimonial.organization}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 p-1">
            <button className="h-2.5 w-2.5 rounded-full bg-primary-500 mx-1" aria-current="true"></button>
            <button className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700 mx-1"></button>
            <button className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700 mx-1"></button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;