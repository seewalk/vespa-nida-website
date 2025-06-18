// components/booking/RentalDetails.js
'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function RentalDetails({
  formData,
  handleChange,
  onNext,
  onPrev,
  minDate,
  rentalDays,
  rentalPrice,
  modelPrices,
  isMobile,
  formVariants
}) {
  const { t } = useLanguage();
  
  // Define routeOptions directly in the component (same as in BookingFormSteps)
  const routeOptions = [
    { id: 'none', name: t('booking.routes.none') },
    { id: 'coastal', name: t('booking.routes.coastal') },
    { id: 'dunes', name: t('booking.routes.dunes') },
    { id: 'village', name: t('booking.routes.village') },
    { id: 'custom', name: t('booking.routes.custom') }
  ];

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h3 className={`font-bold font-syne ${isMobile ? 'text-lg mb-4' : 'text-xl mb-6'}`}>
        {t('booking.steps.details.title')}
      </h3>
      
      <div className={`space-y-4 ${isMobile ? 'mb-6' : 'grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8'}`}>
        <div>
          <label htmlFor="startDate" className="block mb-1 text-sm font-medium">
            {t('booking.steps.details.startDate')}
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            min={minDate}
            className={`w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green ${
              isMobile ? 'text-sm' : 'px-4 py-3 text-base'
            }`}
          />
          <p className={`mt-1 text-graphite-black/50 ${isMobile ? 'text-xs' : 'mt-2 text-sm'}`}>
            {t('booking.steps.details.startTime')}
          </p>
        </div>
        
        <div>
          <label htmlFor="endDate" className="block mb-1 text-sm font-medium">
            {t('booking.steps.details.endDate')}
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            min={formData.startDate || minDate}
            className={`w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green ${
              isMobile ? 'text-sm' : 'px-4 py-3 text-base'
            }`}
          />
          <p className={`mt-1 text-graphite-black/50 ${isMobile ? 'text-xs' : 'mt-2 text-sm'}`}>
            {t('booking.steps.details.endTime')}
          </p>
        </div>
        
        <div>
          <label htmlFor="riders" className="block mb-1 text-sm font-medium">
            {t('booking.steps.details.riders')}
          </label>
          <select
            id="riders"
            name="riders"
            value={formData.riders}
            onChange={handleChange}
            className={`w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green ${
              isMobile ? 'text-sm' : 'px-4 py-3 text-base'
            }`}
          >
            <option value="1">{t('booking.steps.details.onePerson')}</option>
            <option value="2">{t('booking.steps.details.twoPeople')}</option>
          </select>
          <p className={`mt-1 text-graphite-black/50 ${isMobile ? 'text-xs' : 'mt-2 text-sm'}`}>
            {t('booking.steps.details.additionalRider')}
          </p>
        </div>
        
        <div>
          <label htmlFor="route" className="block mb-1 text-sm font-medium">
            {t('booking.steps.details.route')}
          </label>
          <select
            id="route"
            name="route"
            value={formData.route}
            onChange={handleChange}
            className={`w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green ${
              isMobile ? 'text-sm' : 'px-4 py-3 text-base'
            }`}
          >
            <option value="" disabled>{t('booking.steps.details.selectRoute')}</option>
            {routeOptions.map(route => (
              <option key={route.id} value={route.id}>{route.name}</option>
            ))}
          </select>
          <p className={`mt-1 text-graphite-black/50 ${isMobile ? 'text-xs' : 'mt-2 text-sm'}`}>
            {t('booking.steps.details.gpsGuides')}
          </p>
        </div>
      </div>
      
      {/* Price calculation */}
      {rentalDays > 0 && (
        <motion.div 
          className={`mb-6 p-4 bg-sage-green/5 rounded-lg ${isMobile ? '' : 'mb-8 p-6'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h4 className={`font-syne font-bold mb-2 ${isMobile ? 'text-sm' : 'text-lg mb-3'}`}>
            {t('booking.steps.details.rentalSummary')}
          </h4>
          
          {isMobile ? (
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>{formData.model.split(' ')[1]} ({modelPrices[formData.model]}€ × {rentalDays})</span>
                <span>{modelPrices[formData.model] * rentalDays}€</span>
              </div>
              
              {parseInt(formData.riders) > 1 && (
                <div className="flex justify-between">
                  <span>{t('booking.steps.details.riderFee')} (15€ × {rentalDays})</span>
                  <span>{15 * rentalDays}€</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold pt-1 border-t border-sage-green/20 mt-1">
                <span>{t('booking.steps.details.total')}</span>
                <span>{rentalPrice}€</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{formData.model.split(' ')[1]} ({modelPrices[formData.model]}€ × {rentalDays})</span>
                  <span>{modelPrices[formData.model] * rentalDays}€</span>
                </div>
                
                {parseInt(formData.riders) > 1 && (
                  <div className="flex justify-between text-sm">
                    <span>{t('booking.steps.details.riderFee')} (15€ × {rentalDays})</span>
                    <span>{15 * rentalDays}€</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold pt-2 border-t border-sage-green/20 mt-2 text-lg">
                  <span>{t('booking.steps.details.total')}</span>
                  <span>{rentalPrice}€</span>
                </div>
              </div>
              
              <div className="text-sm text-graphite-black/70 bg-white/50 p-4 rounded">
                <p>{t('booking.steps.details.deposit')}</p>
              </div>
            </div>
          )}
          
          {isMobile && (
            <p className="mt-2 text-2xs text-graphite-black/60">
              {t('booking.steps.details.deposit')}
            </p>
          )}
        </motion.div>
      )}
      
      <div className={isMobile ? "flex space-x-3" : "flex justify-between mt-8"}>
        <button 
          type="button" 
          onClick={onPrev}
          className={`${isMobile ? 'px-4 py-2.5 flex-1 text-sm' : 'px-6 py-3'} border border-sage-green text-sage-green rounded-lg font-medium hover:bg-sage-green/5 transition-colors`}
        >
          {t('booking.steps.back')}
        </button>
        
        <button 
          type="button" 
          onClick={onNext}
          className={`${isMobile ? 'btn-primary py-2.5 flex-1 text-sm' : 'btn-primary px-6 py-3'} ${
            !formData.startDate || !formData.endDate ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!formData.startDate || !formData.endDate}
        >
          {t('booking.steps.continue')}
        </button>
      </div>
    </motion.div>
  );
}