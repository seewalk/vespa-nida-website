// booking/PersonalInfo.jsx
'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function PersonalInfo({
  formData,
  handleChange,
  onPrev,
  loading,
  rentalDays,
  rentalPrice,
  isMobile
}) {
  const { t } = useLanguage();

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      key="step3"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h3 className={`font-bold font-syne ${isMobile ? 'text-lg mb-4' : 'text-xl mb-6'}`}>
        {t('booking.steps.personal.title')}
      </h3>
      
      <div className={`space-y-4 ${isMobile ? 'mb-6' : 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8'}`}>
        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-medium">
            {t('booking.steps.personal.name')}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green ${
              isMobile ? 'text-sm' : 'px-4 py-3 text-base'
            }`}
            placeholder={t('booking.steps.personal.namePlaceholder')}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium">
            {t('booking.steps.personal.email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green ${
              isMobile ? 'text-sm' : 'px-4 py-3 text-base'
            }`}
            placeholder={t('booking.steps.personal.emailPlaceholder')}
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block mb-1 text-sm font-medium">
            {t('booking.steps.personal.phone')}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green ${
              isMobile ? 'text-sm' : 'px-4 py-3 text-base'
            }`}
            placeholder={t('booking.steps.personal.phonePlaceholder')}
          />
          <p className={`mt-1 text-graphite-black/50 ${isMobile ? 'text-xs' : 'mt-2 text-sm'}`}>
            {t('booking.steps.personal.phoneNote')}
          </p>
        </div>
        
        <div className={!isMobile ? "md:col-span-2" : ""}>
          <label htmlFor="message" className="block mb-1 text-sm font-medium">
            {t('booking.steps.personal.message')}
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={isMobile ? "3" : "4"}
            className={`w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green ${
              isMobile ? 'text-sm' : 'px-4 py-3 text-base'
            }`}
            placeholder={t('booking.steps.personal.messagePlaceholder')}
          ></textarea>
        </div>
      </div>
      
      {/* Booking summary */}
      <div className={`mb-6 p-4 bg-sage-green/5 rounded-lg ${isMobile ? '' : 'mb-8 p-6'}`}>
        <h4 className={`font-syne font-bold mb-3 ${isMobile ? 'text-sm' : 'text-lg mb-4'}`}>
          {t('booking.steps.personal.summary')}
        </h4>
        
        {isMobile ? (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-graphite-black/60">{t('booking.steps.personal.model')}:</span>
              <span className="font-medium">{formData.model}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-graphite-black/60">{t('booking.steps.personal.duration')}:</span>
              <span className="font-medium">
                {rentalDays} {rentalDays === 1 ? t('booking.steps.personal.day') : t('booking.steps.personal.days')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-graphite-black/60">{t('booking.steps.personal.pickup')}:</span>
              <span className="font-medium">
                {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : t('booking.steps.personal.notSelected')}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-graphite-black/60">{t('booking.steps.personal.dropoff')}:</span>
              <span className="font-medium">
                {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : t('booking.steps.personal.notSelected')}
              </span>
            </div>
            
            <div className="flex justify-between pt-2 border-t border-sage-green/20 mt-1">
              <span className="text-graphite-black/60">{t('booking.steps.personal.totalPrice')}:</span>
              <span className="font-bold">€{rentalPrice}</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-graphite-black/60">{t('booking.steps.personal.model')}:</span>
                <span className="font-medium">{formData.model}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">{t('booking.steps.personal.duration')}:</span>
                <span className="font-medium">
                  {rentalDays} {rentalDays === 1 ? t('booking.steps.personal.day') : t('booking.steps.personal.days')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">{t('booking.steps.personal.pickup')}:</span>
                <span className="font-medium">
                  {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : t('booking.steps.personal.notSelected')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">{t('booking.steps.personal.dropoff')}:</span>
                <span className="font-medium">
                  {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : t('booking.steps.personal.notSelected')}
                </span>
              </div>
              
              <div className="flex justify-between pt-3 border-t border-sage-green/20 mt-2">
                <span className="text-graphite-black/60">{t('booking.steps.personal.totalPrice')}:</span>
                <span className="font-bold text-lg">€{rentalPrice}</span>
              </div>
            </div>
            
            <div className="bg-white/60 p-4 rounded">
              <div className="mb-6">
                <div className="flex gap-2 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <h5 className="text-sm font-medium">€{Math.round(rentalPrice * 0.25)} Deposit</h5>
                    <p className="text-xs text-graphite-black/60">Due at booking</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <h5 className="text-sm font-medium">€{Math.round(rentalPrice * 0.75)} Balance</h5>
                    <p className="text-xs text-graphite-black/60">Due at pickup</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className={`mb-6 flex items-start ${isMobile ? 'mb-6' : 'mb-8'}`}>
        <input 
          type="checkbox" 
          id="terms" 
          className="mt-1 border-sand-beige text-sage-green focus:ring-sage-green rounded" 
          required 
        />
        <label htmlFor="terms" className={`ml-3 text-graphite-black/70 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          {t('booking.steps.personal.termsAgreement')}{' '}
          <a href="#" className="text-sage-green hover:underline">{t('booking.steps.personal.termsLink')}</a>{' '}
          {t('booking.steps.personal.and')}{' '}
          <a href="#" className="text-sage-green hover:underline">{t('booking.steps.personal.privacyLink')}</a>.
        </label>
      </div>
      
      <div className={isMobile ? "flex space-x-3" : "flex justify-between mt-8"}>
        <button 
          type="button" 
          onClick={onPrev}
          className={`${isMobile ? 'px-4 py-2.5 flex-1 text-sm' : 'px-6 py-3'} border border-sage-green text-sage-green rounded-lg font-medium hover:bg-sage-green/5 transition-colors`}
        >
          {t('booking.steps.back')}
        </button>
        
        <button 
          type="submit" 
          className={`${isMobile ? 'btn-primary py-2.5 flex-1 text-sm' : 'btn-primary px-6 py-3'}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{t('booking.steps.processing')}</span>
            </>
          ) : (
            <span>{t('booking.steps.complete')}</span>
          )}
        </button>
      </div>
    </motion.div>
  );
}