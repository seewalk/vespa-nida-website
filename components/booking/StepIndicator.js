// booking/StepIndicator.jsx
'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function StepIndicator({ currentStep }) {
  const { t } = useLanguage();

  const steps = [
    { number: 1, title: t('booking.steps.vespa.title') },
    { number: 2, title: t('booking.steps.details.title') },
    { number: 3, title: t('booking.steps.personal.title') }
  ];

  return (
    <motion.div 
      className="mb-8 hidden md:block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex justify-center items-center">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors duration-300 ${
                currentStep === step.number 
                  ? 'bg-sage-green text-white' 
                  : currentStep > step.number 
                  ? 'bg-sage-green/20 text-sage-green' 
                  : 'bg-graphite-black/10 text-graphite-black/40'
              }`}
            >
              {currentStep > step.number ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                step.number
              )}
            </div>
            
            <div className={`text-sm mx-3 font-medium transition-colors duration-300 ${
              currentStep === step.number ? 'text-graphite-black' : 'text-graphite-black/50'
            }`}>
              {step.title}
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 w-12 transition-colors duration-300 ${
                currentStep > step.number ? 'bg-sage-green' : 'bg-graphite-black/10'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}