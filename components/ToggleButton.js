// components/ToggleButton.jsx
'use client';

import { motion } from 'framer-motion';

export default function ToggleButton({ 
  isOpen = false, 
  onClick, 
  showText, 
  hideText,
  scrollToId = null,
  className = "",
  delay = 0
}) {
  const handleClick = () => {
    onClick();
    
    // If a scrollToId is provided and we're opening (not closing),
    // scroll to that element after a small delay
    if (scrollToId && !isOpen) {
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
      className={`bg-sage-green text-white px-6 py-4 rounded-xl flex items-center justify-center shadow-md ${className}`}
    >
      <span className="mr-2">
        {isOpen ? hideText : showText}
      </span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </motion.button>
  );
}