// components/booking/VespaSelection.js
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

export default function VespaSelection({ 
  formData, 
  setFormData, 
  onNext, 
  onNotifyClick, 
  isMobile, 
  vespaModels, 
  formVariants 
}) {
  const { t } = useLanguage();

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <h3 className={`font-bold mb-4 font-syne ${isMobile ? 'text-lg' : 'text-xl mb-6'}`}>
        {t('booking.steps.vespa.title')}
      </h3>
      
      <div className={`grid gap-4 mb-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3 gap-6 mb-8'}`}>
        {vespaModels.map((model) => (
          <div 
            key={model.id}
            className={`border rounded-${isMobile ? 'lg' : 'xl'} p-2 cursor-pointer transition-all duration-300 relative ${
              formData.model === model.name && !model.comingSoon
                ? 'border-sage-green ring-1 ring-sage-green bg-sage-green/5' 
                : model.comingSoon
                ? 'border-sand-beige bg-sand-beige/5 opacity-80'
                : 'border-sand-beige hover:border-sage-green'
            }`}
            onClick={() => !model.comingSoon && setFormData(prev => ({ ...prev, model: model.name }))}
          >
            {model.comingSoon && (
              <div className="absolute top-2 right-2 z-10 bg-graphite-black/80 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {t('booking.comingSoon')}
              </div>
            )}
            
            <div className={isMobile ? "flex items-center" : ""}>
              <div className={`relative rounded overflow-hidden ${isMobile ? 'w-16 h-16' : 'h-40 mb-3'}`}>
                <Image
                  src={model.image}
                  alt={model.name}
                  fill
                  className={`object-cover ${model.comingSoon ? 'opacity-90' : ''}`}
                  sizes={isMobile ? "64px" : "(max-width: 768px) 100vw, 33vw"}
                />
                {!isMobile && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-0.5 rounded text-xs font-bold">
                      €{model.price}/{t('booking.steps.vespa.day')}
                    </div>
                  </>
                )}
              </div>
              
              <div className={isMobile ? "ml-3 flex-1" : "px-2"}>
                <div className="flex justify-between items-start">
                  <h4 className={`font-syne font-bold ${isMobile ? 'text-sm' : ''}`}>{model.name}</h4>
                  <div 
                    className="w-3 h-3 rounded-full mt-1" 
                    style={{ 
                      backgroundColor: model.color === t('booking.models.primavera.color') ? '#F9F7F1' : 
                                    model.color === t('booking.models.gts.color') ? '#9AA89C' : '#E9DCC9' 
                    }}
                  ></div>
                </div>
                <p className="text-xs text-sage-green">{model.color}</p>
                
                {isMobile ? (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-graphite-black/70">{model.cc}</span>
                    <span className="text-xs font-bold">€{model.price}/day</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-graphite-black/70">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>{model.cc}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span>{model.range}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>{model.topSpeed}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span>{model.idealFor}</span>
                    </div>
                  </div>
                )}
                
                {model.comingSoon && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNotifyClick(model.id);
                    }}
                    className={`${isMobile ? 'mt-2 text-xs' : 'mt-3 text-sm'} text-sage-green flex items-center w-full justify-center py-${isMobile ? '1' : '2'} border border-sage-green rounded ${!isMobile && 'hover:bg-sage-green/5'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {t('booking.notify.notifyMe')}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className={isMobile ? "" : "flex justify-between mt-8"}>
        {!isMobile && <div></div>}
        <button 
          type="button" 
          onClick={onNext}
          className={`${isMobile ? 'btn-primary w-full py-3 text-sm' : 'btn-primary'} flex items-center justify-center`}
        >
          <span>{t('booking.steps.continue')}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}