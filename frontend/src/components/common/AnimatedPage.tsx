import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.35,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // easeOutExpo
};

export const AnimatedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="w-full h-full flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
