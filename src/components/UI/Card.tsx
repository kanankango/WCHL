import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' } : {}}
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;