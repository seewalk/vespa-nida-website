// booking/BookingSuccess.jsx
'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function BookingSuccess({ onNewBooking, isMobile }) {
  const { t } = useLanguage();

  return (
    <motion.div 
      key="success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`bg-white rounded-xl shadow-md text-center ${
        isMobile ? 'p-6' : 'p-10 md:p-16 rounded-2xl shadow-lg'
      }`}
    >
      <div className={`rounded-full bg-sage-green/20 flex items-center justify-center mx-auto mb-4 ${
        isMobile ? 'w-16 h-16' : 'w-20 h-20 mb-6'
      }`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`text-sage-green ${isMobile ? 'h-8 w-8' : 'h-10 w-10'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h3 className={`font-bold font-syne mb-3 ${isMobile ? 'text-xl' : 'text-3xl mb-4'}`}>
        {t('booking.success.title')}
      </h3>
      
      <p className={`text-graphite-black/70 mb-6 ${
        isMobile ? 'text-sm' : 'text-lg mb-8 max-w-md mx-auto'
      }`}>
        {t('booking.success.message')}
      </p>
      
      <div className={`p-4 bg-sage-green/5 rounded-lg mb-6 ${
        isMobile ? 'text-xs' : 'p-6 mb-8'
      }`}>
        <p className={`text-graphite-black/70 ${isMobile ? '' : 'text-sm'}`}>
          {t('booking.success.emailSent')}
        </p>
      </div>
      
      {isMobile ? (
        <button 
          onClick={onNewBooking} 
          className="btn-primary text-sm py-3 px-6 w-full mb-3"
        >
          {t('booking.success.newBooking')}
        </button>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={onNewBooking} 
            className="btn-primary"
          >
            {t('booking.success.newBooking')}
          </button>
          
          <a 
            href="#explore" 
            className="px-6 py-3 border border-sage-green text-sage-green rounded font-medium hover:bg-sage-green/5 transition-colors"
          >
            {t('booking.success.exploreRoutes')}
          </a>
        </div>
      )}
    </motion.div>
  );
}