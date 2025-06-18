// booking/BookingInfo.jsx
'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function BookingInfo({ isMobile }) {
  const { t } = useLanguage();

  const infoItems = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className={`text-sage-green ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('booking.info.hours.title'),
      text: t('booking.info.hours.text')
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className={`text-sage-green ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: t('booking.info.payment.title'),
      text: t('booking.info.payment.text')
    }
  ];

  // Add cancellation info for desktop
  if (!isMobile) {
    infoItems.push({
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: t('booking.info.cancellation.title'),
      text: t('booking.info.cancellation.text')
    });
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`mt-6 space-y-4 ${isMobile ? '' : 'mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'}`}
    >
      {infoItems.map((item, index) => (
        <div key={index} className={`bg-white rounded-lg shadow-sm ${isMobile ? 'p-4' : 'p-6 rounded-xl'}`}>
          <div className="flex items-center mb-2">
            <div className={`rounded-full bg-sage-green/20 flex items-center justify-center mr-3 ${
              isMobile ? 'w-8 h-8' : 'w-10 h-10 mb-4'
            }`}>
              {item.icon}
            </div>
            {!isMobile && <div></div>}
            <h4 className={`font-syne font-bold ${isMobile ? 'text-sm' : ''}`}>
              {item.title}
            </h4>
          </div>
          <p className={`text-graphite-black/70 ${isMobile ? 'text-xs pl-11' : 'text-sm'}`}>
            {item.text}
          </p>
        </div>
      ))}
      
      <motion.div 
        className={`text-center text-graphite-black/60 ${isMobile ? 'mt-6 text-xs' : 'mt-10 text-sm'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {t('booking.assistance')}{' '}
        <a href="tel:+37067956380" className="text-sage-green hover:underline">
          +3706 795 6380
        </a>
      </motion.div>
    </motion.div>
  );
}