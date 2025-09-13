import { motion } from 'framer-motion';

const AnimatedStethoscope = () => {
  return (
    <div className="flex items-center justify-center h-96 w-full bg-transparent">
      <div className="relative w-full max-w-2xl">
        {/* Large Heartbeat Wave */}
        <svg
          width="100%"
          height="200"
          viewBox="0 0 600 200"
          className="w-full h-auto"
        >
          {/* Main Heartbeat Line */}
          <motion.path
            d="M50 100 L150 100 L170 50 L190 150 L210 20 L230 180 L250 100 L550 100"
            stroke="#22c55e"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 1, 0],
              opacity: [0, 0.9, 0.9, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: [0.4, 0.0, 0.2, 1],
              times: [0, 0.2, 0.8, 1]
            }}
          />
          
          {/* Subtle glow effect */}
          <motion.path
            d="M50 100 L150 100 L170 50 L190 150 L210 20 L230 180 L250 100 L550 100"
            stroke="#22c55e"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
            filter="blur(3px)"
            initial={{ pathLength: 0 }}
            animate={{ 
              pathLength: [0, 1, 1, 0],
              opacity: [0, 0.3, 0.3, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: [0.4, 0.0, 0.2, 1],
              times: [0, 0.2, 0.8, 1]
            }}
          />
        </svg>
      </div>
    </div>
  );
};

export default AnimatedStethoscope;
