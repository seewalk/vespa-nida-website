// booking/NotifyModal.jsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function NotifyModal({ showModal, setShowModal, vespaId }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this to your backend
    console.log(`Notify for Vespa ${vespaId}: ${email}`);
    
    // Simulate success
    setTimeout(() => {
      setSubmitted(true);
      // Close modal after showing success message
      setTimeout(() => {
        setShowModal(false);
        setSubmitted(false);
        setEmail('');
      }, 2000);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          onClick={() => {
            setShowModal(false);
            setSubmitted(false);
            setEmail('');
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold font-syne mb-4">
              {t('booking.notify.title')}
            </h3>
            
            {submitted ? (
              <div className="text-center py-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-sage-green mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p>{t('booking.notify.success')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm text-graphite-black/70 mb-4">
                  {t('booking.notify.description')}
                </p>
                
                <div>
                  <label htmlFor="notify-email" className="block text-sm font-medium mb-1">
                    {t('booking.notify.emailLabel')}
                  </label>
                  <input
                    type="email"
                    id="notify-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-sage-green"
                    placeholder={t('booking.notify.emailPlaceholder')}
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEmail('');
                    }}
                    className="px-4 py-2 border border-graphite-black/20 text-graphite-black rounded-lg hover:bg-graphite-black/5"
                  >
                    {t('booking.notify.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sage-green text-white rounded-lg hover:bg-sage-green/90"
                  >
                    {t('booking.notify.submit')}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}