'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useLanguage } from './context/LanguageContext';
import ToggleButton from './ToggleButton';

// Note: Ensure db is properly imported from your firebase config
// import { db } from '../lib/firebase';

export default function BookingForm() {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // Check for mobile and handle resize
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [modelHovered, setModelHovered] = useState(null);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
const [notifyVespaId, setNotifyVespaId] = useState(null);

const handleNotifyClick = (id) => {
  setNotifyVespaId(id);
  setShowNotifyModal(true);
};
  
  // Animation refs
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  // Vespa models data with extended info
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
    comingSoon: true // Mark as coming soon
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
  
  // Route options
  const routeOptions = [
    { id: 'none', name: t('booking.routes.none') },
    { id: 'coastal', name: t('booking.routes.coastal') },
    { id: 'dunes', name: t('booking.routes.dunes') },
    { id: 'village', name: t('booking.routes.village') },
    { id: 'custom', name: t('booking.routes.custom') }
  ];

  // Notification modal component
const NotifyModal = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this to your backend
    console.log(`Notify for Vespa GTS: ${email}`);
    // Simulate success
    setTimeout(() => {
      setSubmitted(true);
      // Close modal after showing success message
      setTimeout(() => {
        setShowNotifyModal(false);
        setSubmitted(false);
      }, 2000);
    }, 1000);
  };
  
  return (
    <AnimatePresence>
      {showNotifyModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          onClick={() => setShowNotifyModal(false)} // Close on background click
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling to parent
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
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
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
                    onClick={() => setShowNotifyModal(false)}
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
};


  // Update rental days and price when dates change
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

  // Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Handle date relationships
    if (name === 'startDate' && formData.endDate && new Date(value) > new Date(formData.endDate)) {
      setFormData(prev => ({ ...prev, endDate: value }));
    }
  };
  
  // Form submission handler
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
  
 // Navigation between form steps
const nextStep = (e) => {
  e.preventDefault();
  setCurrentStep(prev => Math.min(prev + 1, 3));
    
    // Scroll to top of form
    document.getElementById('booking-form-steps').scrollIntoView({ behavior: 'smooth' });
};
  
  const prevStep = (e) => {
  e.preventDefault();
  setCurrentStep(prev => Math.max(prev - 1, 1));
    
    // Scroll to top of form
    document.getElementById('booking-form-steps').scrollIntoView({ behavior: 'smooth' });
};
  
  // Variants for animations
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
          <NotifyModal />
        </motion.div>
        
        
        {isMobile ? (
          // Mobile version with toggle button
          <div className="flex flex-col items-center">
            <ToggleButton 
  isOpen={showBookingForm}
  onClick={() => setShowBookingForm(!showBookingForm)}
  showText={t('booking.showForm')} 
  hideText={t('booking.hideForm')}
  scrollToId="booking-form-steps"
  className="w-full max-w-xs mb-8"
/>
            
            {/* Featured Vespa Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-xs mb-6"
            >
              <div className="aspect-square overflow-hidden rounded-xl shadow-md relative">
                <Image
                  src={vespaModels[0].image}
                  alt={vespaModels[0].name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold font-syne text-lg mb-1">{vespaModels[0].name}</h3>
                  <div className="flex justify-between items-center text-white mb-2">
                    <p className="opacity-80 text-sm">{vespaModels[0].color}</p>
                    <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded">
                      €{vespaModels[0].price}/day
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-white/80">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>{vespaModels[0].cc}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span>{vespaModels[0].range}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Expandable Booking Form */}
<AnimatePresence>
  {showBookingForm && (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full overflow-hidden"
      id="booking-form"
    >
      {/* Success message */}
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-6 rounded-xl shadow-md text-center"
          >
                        <div className="w-16 h-16 rounded-full bg-sage-green/20 flex items-center justify-center mx-auto mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        
                        <h3 className="text-xl font-bold font-syne mb-3">{t('booking.success.title')}</h3>
                        <p className="text-graphite-black/70 mb-6 text-sm">
                          {t('booking.success.message')}
                        </p>
                        
                        <div className="p-4 bg-sage-green/5 rounded-lg mb-6 text-xs">
                          <p className="text-graphite-black/70">
                            {t('booking.success.emailSent')}
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => setSuccess(false)} 
                          className="btn-primary text-sm py-3 px-6 w-full mb-3"
                        >
                          {t('booking.success.newBooking')}
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-md"
            id="booking-form-steps" // Add this ID for the scroll target
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
                        
                        {/* Mobile step indicators */}
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
                        
                        {/* Form Steps */}
                        <AnimatePresence mode="wait">
                          {/* Step 1: Choose Vespa */}
                          {currentStep === 1 && (
                            <motion.div
                              key="step1"
                              variants={formVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                            >
                              <h3 className="text-lg font-bold mb-4 font-syne">{t('booking.steps.vespa.title')}</h3>
                              
                              <div className="grid grid-cols-1 gap-4 mb-6">
  {vespaModels.map((model) => (
    <div 
      key={model.id}
      className={`border rounded-lg p-2 cursor-pointer transition-all duration-300 relative ${
        formData.model === model.name && !model.comingSoon
          ? 'border-sage-green ring-1 ring-sage-green bg-sage-green/5' 
          : model.comingSoon
          ? 'border-sand-beige bg-sand-beige/5 opacity-80'
          : 'border-sand-beige hover:border-sage-green'
      }`}
      onClick={() => !model.comingSoon && setFormData(prev => ({ ...prev, model: model.name }))}
    >
      {/* Coming Soon Badge */}
      {model.comingSoon && (
        <div className="absolute top-2 right-2 z-10 bg-graphite-black/80 text-white px-2 py-0.5 rounded-full text-xs font-bold">
          {t('booking.comingSoon')}
        </div>
      )}
      
      <div className="flex items-center">
        <div className="relative w-16 h-16 rounded overflow-hidden">
          <Image
            src={model.image}
            alt={model.name}
            fill
            className={`object-cover ${model.comingSoon ? 'opacity-90' : ''}`}
            sizes="64px"
          />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-syne font-bold text-sm">{model.name}</h4>
            <div 
              className="w-3 h-3 rounded-full mt-1" 
              style={{ 
                backgroundColor: model.color === t('booking.models.primavera.color') ? '#F9F7F1' : 
                              model.color === t('booking.models.gts.color') ? '#9AA89C' : '#E9DCC9' 
              }}
            ></div>
          </div>
          <p className="text-xs text-sage-green">{model.color}</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-graphite-black/70">{model.cc}</span>
            <span className="text-xs font-bold">€{model.price}/day</span>
          </div>
          
          {/* Notify button for Coming Soon models (mobile) */}
          {model.comingSoon && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNotifyClick(model.id);
              }}
              className="mt-2 text-xs text-sage-green flex items-center w-full justify-center py-1 border border-sage-green rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                              
                              <button 
                                type="button" 
                                onClick={nextStep}
                                className="btn-primary w-full py-3 text-sm flex items-center justify-center"
                              >
                                <span>{t('booking.steps.continue')}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </motion.div>
                          )}
                          
                          {/* Step 2: Rental Details */}
                          {currentStep === 2 && (
                            <motion.div
                              key="step2"
                              variants={formVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                            >
                              <h3 className="text-lg font-bold mb-4 font-syne">{t('booking.steps.details.title')}</h3>
                              
                              <div className="space-y-4 mb-6">
                                <div>
                                  <label htmlFor="startDate" className="block mb-1 text-sm font-medium">{t('booking.steps.details.startDate')}</label>
                                  <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    min={minDate}
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                  />
                                  <p className="mt-1 text-xs text-graphite-black/50">{t('booking.steps.details.startTime')}</p>
                                </div>
                                
                                <div>
                                  <label htmlFor="endDate" className="block mb-1 text-sm font-medium">{t('booking.steps.details.endDate')}</label>
                                  <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    min={formData.startDate || minDate}
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                  />
                                  <p className="mt-1 text-xs text-graphite-black/50">{t('booking.steps.details.endTime')}</p>
                                </div>
                                
                                <div>
                                  <label htmlFor="riders" className="block mb-1 text-sm font-medium">{t('booking.steps.details.riders')}</label>
                                  <select
                                    id="riders"
                                    name="riders"
                                    value={formData.riders}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                  >
                                    <option value="1">{t('booking.steps.details.onePerson')}</option>
                                    <option value="2">{t('booking.steps.details.twoPeople')}</option>
                                  </select>
                                  <p className="mt-1 text-xs text-graphite-black/50">{t('booking.steps.details.additionalRider')}</p>
                                </div>
                                
                                <div>
                                  <label htmlFor="route" className="block mb-1 text-sm font-medium">{t('booking.steps.details.route')}</label>
                                  <select
                                    id="route"
                                    name="route"
                                    value={formData.route}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                  >
                                    <option value="" disabled>{t('booking.steps.details.selectRoute')}</option>
                                    {routeOptions.map(route => (
                                      <option key={route.id} value={route.id}>{route.name}</option>
                                    ))}
                                  </select>
                                  <p className="mt-1 text-xs text-graphite-black/50">{t('booking.steps.details.gpsGuides')}</p>
                                </div>
                              </div>
                              
                              {/* Price calculation */}
                              {rentalDays > 0 && (
                                <motion.div 
                                  className="mb-6 p-4 bg-sage-green/5 rounded-lg"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <h4 className="font-syne font-bold text-sm mb-2">{t('booking.steps.details.rentalSummary')}</h4>
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
                                  <p className="mt-2 text-2xs text-graphite-black/60">
                                    {t('booking.steps.details.deposit')}
                                  </p>
                                </motion.div>
                              )}
                              
                              <div className="flex space-x-3">
                                <button 
                                  type="button" 
                                  onClick={prevStep}
                                  className="px-4 py-2.5 flex-1 border border-sage-green text-sage-green rounded text-sm font-medium"
                                >
                                  {t('booking.steps.back')}
                                </button>
                                
                                <button 
                                  type="button" 
                                  onClick={nextStep}
                                  className={`btn-primary py-2.5 flex-1 text-sm ${
                                    !formData.startDate || !formData.endDate ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  disabled={!formData.startDate || !formData.endDate}
                                >
                                  {t('booking.steps.continue')}
                                </button>
                              </div>
                            </motion.div>
                          )}
                          
                          {/* Step 3: Personal Information */}
                          {currentStep === 3 && (
                            <motion.div
                              key="step3"
                              variants={formVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                            >
                              <h3 className="text-lg font-bold mb-4 font-syne">{t('booking.steps.personal.title')}</h3>
                              
                              <div className="space-y-4 mb-6">
                                <div>
                                  <label htmlFor="name" className="block mb-1 text-sm font-medium">{t('booking.steps.personal.name')}</label>
                                  <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                    placeholder={t('booking.steps.personal.namePlaceholder')}
                                  />
                                </div>
                                
                                <div>
                                  <label htmlFor="email" className="block mb-1 text-sm font-medium">{t('booking.steps.personal.email')}</label>
                                  <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                    placeholder={t('booking.steps.personal.emailPlaceholder')}
                                  />
                                </div>
                                
                                <div>
                                  <label htmlFor="phone" className="block mb-1 text-sm font-medium">{t('booking.steps.personal.phone')}</label>
                                  <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                    placeholder={t('booking.steps.personal.phonePlaceholder')}
                                  />
                                  <p className="mt-1 text-xs text-graphite-black/50">{t('booking.steps.personal.phoneNote')}</p>
                                </div>
                                
                                <div>
                                  <label htmlFor="message" className="block mb-1 text-sm font-medium">{t('booking.steps.personal.message')}</label>
                                  <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                    placeholder={t('booking.steps.personal.messagePlaceholder')}
                                  ></textarea>
                                </div>
                              </div>
                              
                              {/* Booking summary */}
                              <div className="mb-6 p-4 bg-sage-green/5 rounded-lg">
                                <h4 className="font-syne font-bold text-sm mb-3">{t('booking.steps.personal.summary')}</h4>
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
                              </div>
                              
                              <div className="mb-6 flex items-start">
                                <input 
                                  type="checkbox" 
                                  id="terms" 
                                  className="mt-1 border-sand-beige text-sage-green focus:ring-sage-green rounded" 
                                  required 
                                />
                                <label htmlFor="terms" className="ml-3 text-xs text-graphite-black/70">
                                  {t('booking.steps.personal.termsAgreement')}{' '}
                                  <a href="#" className="text-sage-green hover:underline">{t('booking.steps.personal.termsLink')}</a>{' '}
                                  {t('booking.steps.personal.and')}{' '}
                                  <a href="#" className="text-sage-green hover:underline">{t('booking.steps.personal.privacyLink')}</a>.
                                </label>
                              </div>
                              
                              <div className="flex space-x-3">
                                <button 
                                  type="button" 
                                  onClick={prevStep}
                                  className="px-4 py-2.5 flex-1 border border-sage-green text-sage-green rounded text-sm font-medium"
                                >
                                  {t('booking.steps.back')}
                                </button>
                                
                                <button 
                                  type="submit" 
                                  className="btn-primary py-2.5 flex-1 text-sm"
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
                          )}
                        </AnimatePresence>
                      </motion.form>
                    )}
                  </AnimatePresence>
                  
                  {/* Additional booking info */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-6 space-y-4"
                  >
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-sage-green/20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 className="font-syne font-bold text-sm">{t('booking.info.hours.title')}</h4>
                      </div>
                      <p className="text-xs text-graphite-black/70 pl-11">
                        {t('booking.info.hours.text')}
                      </p>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-sage-green/20 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <h4 className="font-syne font-bold text-sm">{t('booking.info.payment.title')}</h4>
                      </div>
                      <p className="text-xs text-graphite-black/70 pl-11">
                        {t('booking.info.payment.text')}
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="mt-6 text-center text-xs text-graphite-black/60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {t('booking.assistance')}{' '}
                    <a href="tel:+37061234567" className="text-sage-green hover:underline">
                      +370 612 34567
                    </a>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // Desktop version - full booking form
          <div className="max-w-5xl mx-auto" id="booking-form">
            {/* Form progress steps */}
            <motion.div 
              className="mb-8 hidden md:block"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex justify-center items-center">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                        currentStep === step 
                          ? 'bg-sage-green text-white' 
                          : currentStep > step 
                          ? 'bg-sage-green/20 text-sage-green' 
                          : 'bg-graphite-black/10 text-graphite-black/40'
                      } transition-colors duration-300`}
                    >
                      {currentStep > step ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step
                      )}
                    </div>
                    
                    <div className={`text-sm mx-3 font-medium ${currentStep === step ? 'text-graphite-black' : 'text-graphite-black/50'}`}>
                      {step === 1 ? t('booking.steps.vespa.title') : step === 2 ? t('booking.steps.details.title') : t('booking.steps.personal.title')}
                    </div>
                    
                    {step < 3 && (
                      <div className={`flex-1 h-0.5 w-12 ${
                        currentStep > step ? 'bg-sage-green' : 'bg-graphite-black/10'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          
            {/* Success message */}
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white p-10 md:p-16 rounded-2xl shadow-lg text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-sage-green/20 flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  
                  <h3 className="text-3xl font-bold font-syne mb-4">{t('booking.success.title')}</h3>
                  <p className="text-lg text-graphite-black/70 mb-8 max-w-md mx-auto">
                    {t('booking.success.message')}
                  </p>
                  
                  <div className="p-6 bg-sage-green/5 rounded-lg mb-8">
                    <p className="text-sm text-graphite-black/70">
                      {t('booking.success.emailSent')}
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => setSuccess(false)} 
                      className="btn-primary"
                    >
                      {t('booking.success.newBooking')}
                    </button>
                    
                    <a href="#explore" className="px-6 py-3 border border-sage-green text-sage-green rounded font-medium hover:bg-sage-green/5 transition-colors">
                      {t('booking.success.exploreRoutes')}
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.form
  key="form"
  onSubmit={handleSubmit}
  className="bg-white p-8 md:p-12 rounded-2xl shadow-lg"
  id="booking-form-steps" // Add the same ID here
>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </motion.div>
                  )}
                  
                  {/* Form Steps */}
                  <AnimatePresence mode="wait">
                    {/* Step 1: Choose Vespa */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <h3 className="text-xl font-bold mb-6 font-syne">{t('booking.steps.vespa.title')}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  {vespaModels.map((model) => (
    <div 
      key={model.id}
      className={`border rounded-xl p-2 cursor-pointer transition-all duration-300 relative ${
        formData.model === model.name && !model.comingSoon
          ? 'border-sage-green ring-1 ring-sage-green bg-sage-green/5' 
          : model.comingSoon
          ? 'border-sand-beige bg-sand-beige/5 opacity-80'
          : 'border-sand-beige hover:border-sage-green'
      }`}
      onClick={() => !model.comingSoon && setFormData(prev => ({ ...prev, model: model.name }))}
      onMouseEnter={() => setModelHovered(model.id)}
      onMouseLeave={() => setModelHovered(null)}
    >
      {/* Coming Soon Badge */}
      {model.comingSoon && (
        <div className="absolute top-2 right-2 z-10 bg-graphite-black/80 text-white px-3 py-1 rounded-full text-xs font-bold">
          {t('booking.comingSoon')}
        </div>
      )}
      
      <div className="relative h-40 mb-3 rounded-lg overflow-hidden">
        <Image
          src={model.image}
          alt={model.name}
          fill
          className={`object-cover ${model.comingSoon ? 'opacity-90' : ''}`}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-0.5 rounded text-xs font-bold">
          €{model.price}/{t('booking.steps.vespa.day')}
        </div>
      </div>
      
      <div className="px-2">
        <div className="flex justify-between items-start">
          <h4 className="font-syne font-bold">{model.name}</h4>
          <div 
            className="w-3 h-3 rounded-full mt-1" 
            style={{ backgroundColor: model.color === t('booking.models.primavera.color') ? '#F9F7F1' : model.color === t('booking.models.gts.color') ? '#9AA89C' : '#E9DCC9' }}
          ></div>
        </div>
        <p className="text-xs text-sage-green mb-2">{model.color}</p>
        
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
        
        {/* Notify button for Coming Soon models (desktop) */}
        {model.comingSoon && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNotifyClick(model.id);
            }}
            className="mt-3 text-sm text-sage-green flex items-center w-full justify-center py-2 border border-sage-green rounded hover:bg-sage-green/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {t('booking.notify.notifyMe')}
          </button>
        )}
      </div>
    </div>
  ))}
</div>
                        
                        <div className="flex justify-between mt-8">
                          <div></div> {/* Empty div for spacing */}
                          <button 
                            type="button" 
                            onClick={nextStep}
                            className="btn-primary flex items-center"
                          >
                            <span>{t('booking.steps.continueDates')}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Other steps remain the same as in the original code but with translations */}
                    {/* Step 2: Rental Details */}
{currentStep === 2 && (
  <motion.div
    key="step2"
    variants={formVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    <h3 className="text-xl font-bold mb-6 font-syne">{t('booking.steps.details.title')}</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
      <div>
        <label htmlFor="startDate" className="block mb-2 text-sm font-medium">{t('booking.steps.details.startDate')}</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
          min={minDate}
          className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
        />
        <p className="mt-2 text-sm text-graphite-black/50">{t('booking.steps.details.startTime')}</p>
      </div>
      
      <div>
        <label htmlFor="endDate" className="block mb-2 text-sm font-medium">{t('booking.steps.details.endDate')}</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
          min={formData.startDate || minDate}
          className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
        />
        <p className="mt-2 text-sm text-graphite-black/50">{t('booking.steps.details.endTime')}</p>
      </div>
      
      <div>
        <label htmlFor="riders" className="block mb-2 text-sm font-medium">{t('booking.steps.details.riders')}</label>
        <select
          id="riders"
          name="riders"
          value={formData.riders}
          onChange={handleChange}
          className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
        >
          <option value="1">{t('booking.steps.details.onePerson')}</option>
          <option value="2">{t('booking.steps.details.twoPeople')}</option>
        </select>
        <p className="mt-2 text-sm text-graphite-black/50">{t('booking.steps.details.additionalRider')}</p>
      </div>
      
      <div>
        <label htmlFor="route" className="block mb-2 text-sm font-medium">{t('booking.steps.details.route')}</label>
        <select
          id="route"
          name="route"
          value={formData.route}
          onChange={handleChange}
          className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
        >
          <option value="" disabled>{t('booking.steps.details.selectRoute')}</option>
          {routeOptions.map(route => (
            <option key={route.id} value={route.id}>{route.name}</option>
          ))}
        </select>
        <p className="mt-2 text-sm text-graphite-black/50">{t('booking.steps.details.gpsGuides')}</p>
      </div>
    </div>
    
    {/* Price calculation */}
    {rentalDays > 0 && (
      <motion.div 
        className="mb-8 p-6 bg-sage-green/5 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h4 className="font-syne font-bold text-lg mb-3">{t('booking.steps.details.rentalSummary')}</h4>
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
            <p>
              {t('booking.steps.details.deposit')}
            </p>
          </div>
        </div>
      </motion.div>
    )}
    
    <div className="flex justify-between mt-8">
      <button 
        type="button" 
        onClick={prevStep}
        className="px-6 py-3 border border-sage-green text-sage-green rounded-lg font-medium hover:bg-sage-green/5 transition-colors"
      >
        {t('booking.steps.back')}
      </button>
      
      <button 
        type="button" 
        onClick={nextStep}
        className={`btn-primary px-6 py-3 ${
          !formData.startDate || !formData.endDate ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!formData.startDate || !formData.endDate}
      >
        {t('booking.steps.continue')}
      </button>
    </div>
  </motion.div>
)}

{/* Step 3: Personal Information */}
{currentStep === 3 && (
  <motion.div
    key="step3"
    variants={formVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    <h3 className="text-xl font-bold mb-6 font-syne">{t('booking.steps.personal.title')}</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
      <div>
        <label htmlFor="name" className="block mb-2 text-sm font-medium">{t('booking.steps.personal.name')}</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
          placeholder={t('booking.steps.personal.namePlaceholder')}
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium">{t('booking.steps.personal.email')}</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
          placeholder={t('booking.steps.personal.emailPlaceholder')}
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block mb-2 text-sm font-medium">{t('booking.steps.personal.phone')}</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
          placeholder={t('booking.steps.personal.phonePlaceholder')}
        />
        <p className="mt-2 text-sm text-graphite-black/50">{t('booking.steps.personal.phoneNote')}</p>
      </div>
      
      <div className="md:col-span-2">
        <label htmlFor="message" className="block mb-2 text-sm font-medium">{t('booking.steps.personal.message')}</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
          placeholder={t('booking.steps.personal.messagePlaceholder')}
        ></textarea>
      </div>
    </div>
    
    {/* Booking summary */}
    <div className="mb-8 p-6 bg-sage-green/5 rounded-lg">
      <h4 className="font-syne font-bold text-lg mb-4">{t('booking.steps.personal.summary')}</h4>
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
    </div>
    
    <div className="mb-8 flex items-start">
      <input 
        type="checkbox" 
        id="terms" 
        className="mt-1 border-sand-beige text-sage-green focus:ring-sage-green rounded" 
        required 
      />
      <label htmlFor="terms" className="ml-3 text-sm text-graphite-black/70">
        {t('booking.steps.personal.termsAgreement')}{' '}
        <a href="#" className="text-sage-green hover:underline">{t('booking.steps.personal.termsLink')}</a>{' '}
        {t('booking.steps.personal.and')}{' '}
        <a href="#" className="text-sage-green hover:underline">{t('booking.steps.personal.privacyLink')}</a>.
      </label>
    </div>
    
    <div className="flex justify-between mt-8">
      <button 
        type="button" 
        onClick={prevStep}
        className="px-6 py-3 border border-sage-green text-sage-green rounded-lg font-medium hover:bg-sage-green/5 transition-colors"
      >
        {t('booking.steps.back')}
      </button>
      
      <button 
        type="submit" 
        className="btn-primary px-6 py-3"
        disabled={loading}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
)}
                  </AnimatePresence>
                </motion.form>
              )}
            </AnimatePresence>
            
            {/* Additional information */}
            <motion.div 
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-full bg-sage-green/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-syne font-bold mb-2">{t('booking.info.hours.title')}</h4>
                <p className="text-sm text-graphite-black/70">
                  {t('booking.info.hours.text')}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-full bg-sage-green/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-syne font-bold mb-2">{t('booking.info.payment.title')}</h4>
                <p className="text-sm text-graphite-black/70">
                  {t('booking.info.payment.text')}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-full bg-sage-green/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h4 className="font-syne font-bold mb-2">{t('booking.info.cancellation.title')}</h4>
                <p className="text-sm text-graphite-black/70">
                  {t('booking.info.cancellation.text')}
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-10 text-center"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-sm text-graphite-black/60">
                {t('booking.assistance')} <a href="tel:+37061234567" className="text-sage-green hover:underline">+370 612 34567</a>
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}