// components/booking/BookingFormSteps.js
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import StepIndicator from './StepIndicator';
import VespaSelection from './VespaSelection';
import RentalDetails from './RentalDetails';
import PersonalInfo from './PersonalInfo';

export default function BookingFormSteps({
  formData,
  setFormData,
  currentStep,
  setCurrentStep,
  loading,
  setLoading,
  error,
  setError,
  setSuccess,
  onNotifyClick,
  isMobile
}) {
  const { t } = useLanguage();
  
  // Calculate min date for the datepicker (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  
  // Calculate rental duration and price
  const [rentalDays, setRentalDays] = useState(0);
  const [rentalPrice, setRentalPrice] = useState(0);
  
  const modelPrices = {
    [t('booking.models.primavera.name')]: 79,
    [t('booking.models.gts.name')]: 99,
    [t('booking.models.sprint.name')]: 69
  };

  // Vespa models data with extended info (MOVED FROM OLD VERSION)
  const vespaModels = [
    {
      id: 'primavera',
      name: t('booking.models.primavera.name'),
      color: t('booking.models.primavera.color'),
      cc: t('booking.models.primavera.cc'),
      topSpeed: t('booking.models.primavera.topSpeed'),
      range: t('booking.models.primavera.range'),
      idealFor: t('booking.models.primavera.idealFor'),
      image: '/images/fleet-white-vespa.jpg',
      price: 79,
      comingSoon: false
    },
    {
      id: 'gts',
      name: t('booking.models.gts.name'),
      color: t('booking.models.gts.color'),
      cc: t('booking.models.gts.cc'),
      topSpeed: t('booking.models.gts.topSpeed'),
      range: t('booking.models.gts.range'),
      idealFor: t('booking.models.gts.idealFor'),
      image: '/images/fleet-green-vespa.jpg',
      price: 99,
      comingSoon: true
    },
    {
      id: 'sprint',
      name: t('booking.models.sprint.name'),
      color: t('booking.models.sprint.color'),
      cc: t('booking.models.sprint.cc'),
      topSpeed: t('booking.models.sprint.topSpeed'),
      range: t('booking.models.sprint.range'),
      idealFor: t('booking.models.sprint.idealFor'),
      image: '/images/fleet-beige-vespa.jpg',
      price: 69,
      comingSoon: false
    }
  ];
  
  // Route options (MOVED FROM OLD VERSION)
  const routeOptions = [
    { id: 'none', name: t('booking.routes.none') },
    { id: 'coastal', name: t('booking.routes.coastal') },
    { id: 'dunes', name: t('booking.routes.dunes') },
    { id: 'village', name: t('booking.routes.village') },
    { id: 'custom', name: t('booking.routes.custom') }
  ];

  // Update rental days and price when dates change (MOVED FROM OLD VERSION)
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setRentalDays(diffDays);
      
      const basePrice = modelPrices[formData.model] || 79;
      const ridersCount = parseInt(formData.riders) || 1;
      const extraRiderFee = ridersCount > 1 ? 15 : 0;
      
      setRentalPrice((basePrice + extraRiderFee) * diffDays);
    } else {
      setRentalDays(0);
      setRentalPrice(0);
    }
  }, [formData.startDate, formData.endDate, formData.model, formData.riders, modelPrices]);

  // Form input change handler (MOVED FROM OLD VERSION)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Handle date relationships
    if (name === 'startDate' && formData.endDate && new Date(value) > new Date(formData.endDate)) {
      setFormData(prev => ({ ...prev, endDate: value }));
    }
  };

  // Form submission handler (MOVED FROM OLD VERSION)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Uncomment this when you have Firebase properly configured
      // await addDoc(collection(db, "bookings"), {
      //   ...formData,
      //   rentalDays,
      //   rentalPrice,
      //   createdAt: new Date()
      // });
      
      // For demo purposes, simulating a successful submission with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setFormData({
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
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(t('booking.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  // Navigation between form steps (MOVED FROM OLD VERSION)
  const nextStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, 3));
    document.getElementById('booking-form-steps')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const prevStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
    document.getElementById('booking-form-steps')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Variants for animations (MOVED FROM OLD VERSION)
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      {!isMobile && (
        <StepIndicator currentStep={currentStep} />
      )}
      
      <motion.form
        onSubmit={handleSubmit}
        className={isMobile ? "bg-white p-6 rounded-xl shadow-md" : "bg-white p-8 md:p-12 rounded-2xl shadow-lg"}
        id="booking-form-steps"
      >
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </motion.div>
        )}
        
        {isMobile && (
          <div className="flex justify-center mb-6">
            {[1, 2, 3].map((step) => (
              <div 
                key={step} 
                className={`w-3 h-3 mx-1 rounded-full ${
                  currentStep === step 
                    ? 'bg-sage-green' 
                    : currentStep > step 
                    ? 'bg-sage-green/30' 
                    : 'bg-graphite-black/20'
                }`}
              ></div>
            ))}
          </div>
        )}
        
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <VespaSelection
              key="step1"
              formData={formData}
              setFormData={setFormData}
              onNext={nextStep}
              onNotifyClick={onNotifyClick}
              isMobile={isMobile}
              vespaModels={vespaModels}
              formVariants={formVariants}
            />
          )}
          
{currentStep === 2 && (
  <RentalDetails
    key="step2"
    formData={formData}
    handleChange={handleChange}
    onNext={nextStep}
    onPrev={prevStep}
    minDate={minDate}
    rentalDays={rentalDays}
    rentalPrice={rentalPrice}
    modelPrices={modelPrices}
    routeOptions={routeOptions} // This is already defined in BookingFormSteps
    isMobile={isMobile}
    formVariants={formVariants}
  />
)}
          
          {currentStep === 3 && (
            <PersonalInfo
              key="step3"
              formData={formData}
              handleChange={handleChange}
              onPrev={prevStep}
              loading={loading}
              rentalDays={rentalDays}
              rentalPrice={rentalPrice}
              isMobile={isMobile}
              formVariants={formVariants}
            />
          )}
        </AnimatePresence>
      </motion.form>
    </>
  );
}