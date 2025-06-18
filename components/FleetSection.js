'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useLanguage } from './context/LanguageContext';

export default function FleetSection() {
  const { t } = useLanguage();
  const [activeVespa, setActiveVespa] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(true); // Default to true for server rendering
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyVespaId, setNotifyVespaId] = useState(null);
  const sectionRef = useRef(null);
  const carouselRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  // Initialize and update the window width
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
  
  // Updated fleet items to match BookingForm with detailed specifications
  const fleetItems = [
    {
      id: 1,
      name: t('booking.models.sprint.name'),
      color: t('booking.models.sprint.color'),
      power: t('booking.models.sprint.power'),
      maxSpeed: t('booking.models.sprint.maxSpeed'),
      range: t('booking.models.sprint.range'),
      idealFor: t('booking.models.sprint.idealFor'),
      description: t('fleet.items.sprint.description'),
      image: '/images/fleet-vespa-1.png',
      price: 59,
      originalPrice: 69,
      comingSoon: false,
      features: t('fleet.items.sprint.features'),
      detailedSpecs: t('fleet.items.sprint.detailedSpecs')
    },
    {
      id: 2,
      name: t('booking.models.sprint2.name'),
      color: t('booking.models.sprint2.color'),
      power: t('booking.models.sprint2.power'),
      maxSpeed: t('booking.models.sprint2.maxSpeed'),
      range: t('booking.models.sprint2.range'),
      idealFor: t('booking.models.sprint2.idealFor'),
      description: t('fleet.items.sprint2.description'),
      image: '/images/fleet-vespa-1.png',
      price: 59,
      originalPrice: 69,
      comingSoon: true,
      features: t('fleet.items.sprint2.features'),
      detailedSpecs: t('fleet.items.sprint2.detailedSpecs')
    },
    {
      id: 3,
      name: t('booking.models.sprint3.name'),
      color: t('booking.models.sprint3.color'),
      power: t('booking.models.sprint3.power'),
      maxSpeed: t('booking.models.sprint3.maxSpeed'),
      range: t('booking.models.sprint3.range'),
      idealFor: t('booking.models.sprint3.idealFor'),
      description: t('fleet.items.sprint3.description'),
      image: '/images/fleet-vespa-1.png',
      price: 59,
      originalPrice: 69,
      comingSoon: true,
      features: t('fleet.items.sprint3.features'),
      detailedSpecs: t('fleet.items.sprint3.detailedSpecs')
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Handle vespa card click for mobile detail view
  const handleVespaClick = (id) => {
    setActiveVespa(activeVespa === id ? null : id);
  };

  // Carousel navigation functions - moved outside of useEffect
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % fleetItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + fleetItems.length) % fleetItems.length);
  };

  // Auto-advance carousel on mobile - simplified
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % fleetItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isMobile, fleetItems.length]);

  // Function to handle "Notify When Available" button click
  const handleNotifyClick = (id) => {
    setNotifyVespaId(id);
    setShowNotifyModal(true);
  };

  // Function to scroll to booking form
  const scrollToBookingForm = () => {
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
      bookingForm.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If booking-form doesn't exist, try to scroll to the contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Enhanced notification modal component with additional fields
  const NotifyModal = () => {
    const [notifyData, setNotifyData] = useState({
      name: '',
      phone: '',
      email: ''
    });
    const [submitted, setSubmitted] = useState(false);
    
    const handleSubmit = (e) => {
      e.preventDefault();
      // Here you would typically send this to your backend
      console.log(`Notify for vespa ID ${notifyVespaId}:`, notifyData);
      // Simulate success
      setTimeout(() => {
        setSubmitted(true);
        // Close modal after showing success message
        setTimeout(() => {
          setShowNotifyModal(false);
          setSubmitted(false);
          setNotifyData({ name: '', phone: '', email: '' });
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
            onClick={() => setShowNotifyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold font-syne mb-4">
                {t('fleet.buttons.notifyTitle')}
              </h3>
              
              {submitted ? (
                <div className="text-center py-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-sage-green mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>{t('fleet.buttons.notifySuccess')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-sm text-graphite-black/70 mb-4">
                    {t('fleet.buttons.notifyDescription')}
                  </p>
                  
                  <div>
                    <label htmlFor="notify-name" className="block text-sm font-medium mb-1">
                      {t('fleet.buttons.nameLabel')} *
                    </label>
                    <input
                      type="text"
                      id="notify-name"
                      value={notifyData.name}
                      onChange={(e) => setNotifyData({...notifyData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-sage-green"
                      placeholder={t('fleet.buttons.namePlaceholder')}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="notify-phone" className="block text-sm font-medium mb-1">
                      {t('fleet.buttons.phoneLabel')} *
                    </label>
                    <input
                      type="tel"
                      id="notify-phone"
                      value={notifyData.phone}
                      onChange={(e) => setNotifyData({...notifyData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-sage-green"
                      placeholder={t('fleet.buttons.phonePlaceholder')}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="notify-email" className="block text-sm font-medium mb-1">
                      {t('fleet.buttons.emailLabel')} *
                    </label>
                    <input
                      type="email"
                      id="notify-email"
                      value={notifyData.email}
                      onChange={(e) => setNotifyData({...notifyData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-sage-green"
                      placeholder={t('fleet.buttons.emailPlaceholder')}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowNotifyModal(false)}
                      className="px-4 py-2 border border-graphite-black/20 text-graphite-black rounded-lg hover:bg-graphite-black/5"
                    >
                      {t('fleet.buttons.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-sage-green text-white rounded-lg hover:bg-sage-green/90"
                    >
                      {t('fleet.buttons.notifySubmit')}
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

  return (
    <section id="fleet" className="py-20 md:py-32 bg-white relative" ref={sectionRef}>
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sage-green/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sand-beige/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block font-syne uppercase tracking-wider text-sage-green mb-2 text-sm">{t('fleet.subtitle')}</span>
          <h2 className="text-3xl md:text-5xl font-bold font-syne text-graphite-black">{t('fleet.title')}</h2>
          <div className="w-24 h-1 bg-sage-green mx-auto mt-6 mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-graphite-black/70">
            {t('fleet.description')}
          </p>
        </motion.div>
        
        {isMobile ? (
          // Mobile Carousel View
          <div className="relative" ref={carouselRef}>
            <div className="overflow-hidden mx-4">
              <motion.div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {fleetItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="w-full flex-shrink-0 px-4"
                  >
                    <div className="bg-ivory-white rounded-xl overflow-hidden shadow-md relative">
                      {/* Coming Soon Badge */}
                      {item.comingSoon && (
                        <div className="absolute top-4 right-4 z-10 bg-graphite-black/80 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {t('fleet.buttons.comingSoon')}
                        </div>
                      )}
                      
                      <div className="relative h-64 overflow-hidden">
                        <Image 
                          src={item.image} 
                          alt={`${item.name} in ${item.color}`}
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 p-4 w-full">
                          <h3 className="text-white text-xl font-bold font-syne">{item.name}</h3>
                          <p className="text-white/80 text-sm">{item.color}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-white font-medium text-xs inline-block bg-sage-green/90 px-3 py-1 rounded-full">
                              {item.power}
                            </p>
                            <div className="text-white text-xs font-bold bg-white/20 px-2 py-0.5 rounded">
                              <span className="line-through opacity-60">€{item.originalPrice}</span>
                              <span className="ml-1">€{item.price}/day</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="mb-3">
                          <div className="grid grid-cols-2 gap-2 text-xs text-graphite-black/70">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              <span>{item.power}</span>
                            </div>
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 113 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                              <span>{item.range}</span>
                            </div>
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              <span>{item.maxSpeed}</span>
                            </div>
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span>{item.idealFor}</span>
                            </div>
                          </div>
                        </div>

                        {/* Conditional Button Based on Coming Soon Status */}
                        {item.comingSoon ? (
                          <button 
                            className="w-full py-3 border border-sage-green text-sage-green rounded-lg flex items-center justify-center hover:bg-sage-green/5 transition-colors text-sm"
                            onClick={() => handleNotifyClick(item.id)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span>{t('fleet.buttons.notifyWhenAvailable')}</span>
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <button 
                              className="btn-primary w-full py-3 text-sm"
                              onClick={scrollToBookingForm}
                            >
                              {t('fleet.buttons.reserveNow')}
                            </button>
                            <button 
                              className="w-full py-2 text-sage-green border border-sage-green rounded-lg text-sm hover:bg-sage-green/5 transition-colors"
                              onClick={() => setActiveVespa(item.id)}
                            >
                              {t('fleet.buttons.details')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
            
            {/* Carousel Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {fleetItems.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-sage-green' : 'bg-sage-green/30'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Left/Right Navigation for Mobile - Fixed positioning and z-index */}
            <button 
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg z-20 hover:bg-white transition-colors"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-graphite-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg z-20 hover:bg-white transition-colors"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-graphite-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Detailed View Modal */}
            <AnimatePresence>
              {activeVespa && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                  onClick={() => setActiveVespa(null)}
                >
                  <motion.div 
                    className="bg-ivory-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    onClick={e => e.stopPropagation()}
                  >
                    {(() => {
                      const item = fleetItems.find(item => item.id === activeVespa);
                      return (
                        <>
                          <div className="relative h-48 overflow-hidden">
                            <Image 
                              src={item.image} 
                              alt={item.name}
                              fill
                              sizes="100vw"
                              className="object-cover"
                            />
                            <button 
                              className="absolute top-2 right-2 bg-black/50 rounded-full p-2 text-white"
                              onClick={() => setActiveVespa(null)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            
                            {/* Coming Soon Badge in Modal */}
                            {item.comingSoon && (
                              <div className="absolute top-4 left-4 z-10 bg-graphite-black/80 text-white px-3 py-1 rounded-full text-xs font-bold">
                                {t('fleet.buttons.comingSoon')}
                              </div>
                            )}

                            <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-0.5 rounded text-xs font-bold">
                              <span className="line-through opacity-60">€{item.originalPrice}</span>
                              <span className="ml-1 text-sage-green">€{item.price}/day</span>
                            </div>
                          </div>
                          
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-xl font-bold font-syne">
                                  {item.name}
                                </h3>
                                <p className="text-sage-green font-medium">
                                  {item.color}
                                </p>
                              </div>
                              <div 
                                className="h-8 w-8 rounded-full" 
                                style={{ 
                                  backgroundColor: 
                                    item.color === t('booking.models.sprint.color') ? '#F9F7F1' :
                                    item.color === t('booking.models.sprint2.color') ? '#9AA89C' : '#E9DCC9'
                                }}
                              ></div>
                            </div>

                            {/* Key Specs Grid */}
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4 text-xs">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                <span>{item.power}</span>
                              </div>
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 113 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <span>{item.range}</span>
                              </div>
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>{item.maxSpeed}</span>
                              </div>
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span>{item.idealFor}</span>
                              </div>
                            </div>
                            
                            <p className="mb-6 text-graphite-black/80 text-sm">
                              {item.description}
                            </p>
                            
                            <div className="space-y-3 mb-6">
                              <h4 className="font-semibold text-sm text-graphite-black/70 uppercase tracking-wider">
                                {t('fleet.features')}
                              </h4>
                              <ul className="space-y-2">
                                {(Array.isArray(item.features) ? item.features : []).map((feature, idx) => (
                                  <li key={idx} className="flex items-center text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Detailed Specifications */}
                            <div className="space-y-3 mb-6">
                              <h4 className="font-semibold text-sm text-graphite-black/70 uppercase tracking-wider">
                                {t('fleet.detailedSpecs')}
                              </h4>
                              <div className="bg-sage-green/5 p-3 rounded-lg">
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                                  {item.detailedSpecs.map((spec, idx) => (
                                    <div key={idx} className="flex justify-between">
                                      <span className="text-graphite-black/60">{spec.label}:</span>
                                      <span className="font-medium">{spec.value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            {/* Conditional Button In Modal */}
                            {item.comingSoon ? (
                              <button 
                                className="w-full py-3 border border-sage-green text-sage-green rounded-lg flex items-center justify-center hover:bg-sage-green/5 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveVespa(null);
                                  handleNotifyClick(item.id);
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span>{t('fleet.buttons.notifyWhenAvailable')}</span>
                              </button>
                            ) : (
                              <button 
                                className="btn-primary w-full py-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveVespa(null);
                                  scrollToBookingForm();
                                }}
                              >
                                {t('fleet.buttons.reserveNow')}
                              </button>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // Desktop Grid View
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {fleetItems.map((item) => (
              <motion.div 
                key={item.id} 
                variants={itemVariants}
                className={`bg-ivory-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative ${
                  activeVespa === item.id ? 'ring-2 ring-sage-green' : ''
                }`}
              >
                {/* Coming Soon Badge for Desktop */}
                {item.comingSoon && (
                  <div className="absolute top-4 right-4 z-10 bg-graphite-black/80 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {t('fleet.buttons.comingSoon')}
                  </div>
                )}
                
                <div className="relative h-72 overflow-hidden group">
                  <Image 
                    src={item.image} 
                    alt={`${item.name} in ${item.color}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute bottom-0 left-0 p-4 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium text-sm inline-block bg-sage-green/90 px-3 py-1 rounded-full">
                        {item.power}
                      </p>
                      <div className="text-white text-sm font-bold bg-white/20 px-2 py-0.5 rounded">
                        <span className="line-through opacity-60">€{item.originalPrice}</span>
                        <span className="ml-1">€{item.price}/day</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-2xl font-bold font-syne">{item.name}</h3>
                      <p className="text-sage-green font-medium">{item.color}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full" style={{ backgroundColor: 
                      item.color === t('booking.models.sprint.color') ? '#F9F7F1' :
                      item.color === t('booking.models.sprint2.color') ? '#9AA89C' :
                      item.color === t('booking.models.sprint3.color') ? '#E9DCC9' : '#B0B0B0'
                    }}></div>
                  </div>

                  {/* Key Specs Grid */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-graphite-black/70 mb-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>{item.power}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 113 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span>{item.range}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span>{item.maxSpeed}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{item.idealFor}</span>
                    </div>
                  </div>
                  
                  <p className="mb-6 text-graphite-black/80">{item.description}</p>
                  
                  {/* Features list - always visible on desktop */}
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-sm text-graphite-black/70 uppercase tracking-wider">{t('fleet.features')}</h4>
                    <ul className="space-y-1">
                      {(Array.isArray(item.features) ? item.features : []).map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex space-x-4">
                    {/* Conditional Button Based on Coming Soon Status */}
                    {item.comingSoon ? (
                      <button 
                        className="border border-sage-green text-sage-green py-3 px-4 rounded flex-1 hover:bg-sage-green/10 transition-colors flex items-center justify-center"
                        onClick={() => handleNotifyClick(item.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span>{t('fleet.buttons.notifyWhenAvailable')}</span>
                      </button>
                    ) : (
                      <button 
                        className="btn-primary flex-1 py-3"
                        onClick={scrollToBookingForm}
                      >
                        {t('fleet.buttons.reserveNow')}
                      </button>
                    )}
                    
                    <button 
                      className="border border-sage-green text-sage-green py-3 px-4 rounded hover:bg-sage-green/10 transition-colors"
                      onClick={() => handleVespaClick(item.id)}
                      aria-label={t('fleet.buttons.moreInfo')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-graphite-black/70 mb-6">{t('fleet.customRental')}</p>
          <a href="#contact" className="inline-flex items-center text-sage-green hover:text-sage-green/80 font-medium">
            <span>{t('fleet.contactTeam')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>
      
      {/* Add notification modal */}
      <NotifyModal />
    </section>
  );
}