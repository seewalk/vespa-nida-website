'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from './context/LanguageContext';
import ToggleButton from './ToggleButton';
import BookingFormSteps from './booking/BookingFormSteps';
import BookingSuccess from './booking/BookingSuccess';
import NotifyModal from './booking/NotifyModal';
import VespaPreview from './booking/VespaPreview';
import BookingInfo from './booking/BookingInfo';

export default function BookingForm() {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
    model: t('booking.models.primavera.name'),
    route: '',
    riders: '1',
    message: ''
  });
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyVespaId, setNotifyVespaId] = useState(null);
  
  // Animation refs
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Check for mobile and handle resize
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNotifyClick = (id) => {
    setNotifyVespaId(id);
    setShowNotifyModal(true);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-ivory-white relative" ref={sectionRef}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-sage-green/5 rounded-full"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sage-green/5 rounded-full"></div>
      </div>
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block font-syne uppercase tracking-wider text-sage-green mb-2 text-sm">{t('booking.subtitle')}</span>
          <h2 className="text-3xl md:text-5xl font-bold font-syne text-graphite-black">{t('booking.title')}</h2>
          <div className="w-24 h-1 bg-sage-green mx-auto mt-6 mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-graphite-black/70">
            {t('booking.description')}
          </p>
        </motion.div>
        
        <NotifyModal 
          showModal={showNotifyModal}
          setShowModal={setShowNotifyModal}
          vespaId={notifyVespaId}
        />
        
        {isMobile ? (
          <div className="flex flex-col items-center">
            <ToggleButton 
              isOpen={showBookingForm}
              onClick={() => setShowBookingForm(!showBookingForm)}
              showText={t('booking.showForm')} 
              hideText={t('booking.hideForm')}
              scrollToId="booking-form-steps"
              className="w-full max-w-xs mb-8"
            />
            
            <VespaPreview />
            
            {showBookingForm && (
              <div className="w-full" id="booking-form">
                {success ? (
                  <BookingSuccess 
                    onNewBooking={() => setSuccess(false)}
                    isMobile={true}
                  />
                ) : (
                  <BookingFormSteps
                    formData={formData}
                    setFormData={setFormData}
                    currentStep={currentStep}
                    setCurrentStep={setCurrentStep}
                    loading={loading}
                    setLoading={setLoading}
                    error={error}
                    setError={setError}
                    setSuccess={setSuccess}
                    onNotifyClick={handleNotifyClick}
                    isMobile={true}
                  />
                )}
                
                <BookingInfo isMobile={true} />
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto" id="booking-form">
            {success ? (
              <BookingSuccess 
                onNewBooking={() => setSuccess(false)}
                isMobile={false}
              />
            ) : (
              <BookingFormSteps
                formData={formData}
                setFormData={setFormData}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                loading={loading}
                setLoading={setLoading}
                error={error}
                setError={setError}
                setSuccess={setSuccess}
                onNotifyClick={handleNotifyClick}
                isMobile={false}
              />
            )}
            
            <BookingInfo isMobile={false} />
          </div>
        )}
      </div>
    </section>
  );
}