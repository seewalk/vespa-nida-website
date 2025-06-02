// components/ToggleFAQButton.jsx
'use client';

import { motion } from 'framer-motion';

export default function ToggleFAQButton({ 
  text,
  scrollToId = null,
  className = "",
  delay = 0
}) {
  const handleClick = () => {
    // If a scrollToId is provided, scroll to that element
    if (scrollToId) {
      setTimeout(() => {
        const element = document.getElementById(scrollToId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      onClick={handleClick}
      className={`px-6 py-3 bg-graphite-black text-white rounded-lg font-medium hover:bg-graphite-black/90 transition-colors flex items-center justify-center ${className}`}
    >
      <span className="mr-2">{text}</span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-5 w-5"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </motion.button>
  );
}