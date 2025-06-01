'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, languages } from './context/LanguageContext';
import Image from 'next/image';

export default function MobileLanguageSelector() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { currentLanguage, changeLanguage, t } = useLanguage();

  // Check if we're on a mobile device and if this is the first visit
  useEffect(() => {
    // Function to check device width
    const checkIfMobile = () => {
      return window.innerWidth < 768;
    };

    // Check if the language preference was already set in this session
    const languageAlreadySelected = sessionStorage.getItem('languageSelected');

    // Set initial states
    setIsMobile(checkIfMobile());
    setIsVisible(checkIfMobile() && !languageAlreadySelected);

    // Handle resize
    const handleResize = () => {
      setIsMobile(checkIfMobile());
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Prevent scrolling when modal is open
    if (checkIfMobile() && !languageAlreadySelected) {
      document.body.style.overflow = 'hidden';
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle language selection
  const handleLanguageSelect = (code) => {
    changeLanguage(code);
    sessionStorage.setItem('languageSelected', 'true');
    setIsVisible(false);
    document.body.style.overflow = 'unset';
  };

  // Only render on mobile and when visible
  if (!isMobile || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-graphite-black/90 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl"
          >
            <div className="flex justify-center mb-6">
              <Image 
                src="/images/logo.jpg" 
                alt="Vespa Nida Logo" 
                width={150} 
                height={50}
                className="h-10 w-auto"
              />
            </div>

            <h2 className="text-xl font-syne font-bold text-center text-graphite-black mb-2">
              {t('languageSelector.title')}
            </h2>
            <p className="text-sm text-center text-graphite-black/70 mb-6">
              {t('languageSelector.subtitle')}
            </p>

            <div className="space-y-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className="w-full py-3 px-4 flex items-center justify-between bg-sage-green/5 hover:bg-sage-green/10 rounded-xl transition-colors border border-sage-green/20 focus:outline-none focus:ring-2 focus:ring-sage-green"
                >
                  <div className="flex items-center">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-sage-green/10 text-sage-green mr-3 font-bold">
                      {lang.code.toUpperCase()}
                    </span>
                    <span className="font-medium text-graphite-black">{lang.name}</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
