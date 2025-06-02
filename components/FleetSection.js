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
  
  const fleetItems = [
    {
      id: 1,
      name: t('fleet.items.primavera.name'),
      color: t('fleet.items.primavera.color'),
      description: t('fleet.items.primavera.description'),
      image: '/images/fleet-white-vespa.jpg',
      specs: t('fleet.items.primavera.specs'),
      comingSoon: false,
      features: [
        t('fleet.items.primavera.features.0'),
        t('fleet.items.primavera.features.1'),
        t('fleet.items.primavera.features.2'),
        t('fleet.items.primavera.features.3')
      ]
    },
    {
      id: 2,
      name: t('fleet.items.gts.name'),
      color: t('fleet.items.gts.color'),
      description: t('fleet.items.gts.description'),
      image: '/images/fleet-green-vespa.jpg',
      specs: t('fleet.items.gts.specs'),
      comingSoon: true, // Mark as coming soon
      features: [
        t('fleet.items.gts.features.0'),
        t('fleet.items.gts.features.1'),
        t('fleet.items.gts.features.2'),
        t('fleet.items.gts.features.3')
      ]
    },
    {
      id: 3,
      name: t('fleet.items.sprint.name'),
      color: t('fleet.items.sprint.color'),
      description: t('fleet.items.sprint.description'),
      image: '/images/fleet-beige-vespa.jpg',
      specs: t('fleet.items.sprint.specs'),
      comingSoon: false,
      features: [
        t('fleet.items.sprint.features.0'),
        t('fleet.items.sprint.features.1'),
        t('fleet.items.sprint.features.2'),
        t('fleet.items.sprint.features.3')
      ]
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

  // Carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % fleetItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + fleetItems.length) % fleetItems.length);
  };

  // Auto-advance carousel on mobile with improved handling
  useEffect(() => {
    if (isMobile && carouselRef.current) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isMobile, currentSlide]);

  // Handle mobile swipe for carousel
  useEffect(() => {
    if (isMobile && carouselRef.current) {
      let startX = 0;
      
      const handleTouchStart = (e) => {
        startX = e.touches[0].clientX;
      };
      
      const handleTouchEnd = (e) => {
        const diffX = startX - e.changedTouches[0].clientX;
        const threshold = 50; // minimum distance for swipe
        
        if (Math.abs(diffX) < threshold) return;
        
        if (diffX > 0) {
          // Swipe left - next slide
          nextSlide();
        } else {
          // Swipe right - previous slide
          prevSlide();
        }
      };
      
      const element = carouselRef.current;
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isMobile]);

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

  // Notification modal component
  const NotifyModal = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    
    const handleSubmit = (e) => {
      e.preventDefault();
      // Here you would typically send this to your backend
      console.log(`Notify for vespa ID ${notifyVespaId}: ${email}`);
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
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      {t('fleet.buttons.emailLabel')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
          // Mobile Carousel View with improved handling
          <div className="relative px-4" ref={carouselRef}>
            <div className="overflow-hidden">
              <motion.div 
                className="flex"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: `-${currentSlide * 100}%` }}
                transition={{ duration: 0.5 }}
                style={{ width: `${fleetItems.length * 100}%` }}
              >
                {fleetItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="w-full flex-shrink-0 px-4"
                    style={{ width: `${100 / fleetItems.length}%` }}
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
                          <p className="text-white font-medium text-xs mt-2 inline-block bg-sage-green/90 px-3 py-1 rounded-full">
                            {item.specs}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4">
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
                          <button 
                            className="btn-primary w-full py-3 text-sm"
                            onClick={() => {
                              // For available scooters, view details and then scroll to booking
                              setActiveVespa(item.id);
                            }}
                          >
                            {t('fleet.buttons.reserveNow')}
                          </button>
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
            
            {/* Left/Right Navigation for Mobile */}
            <button 
              className="absolute top-1/2 left-0 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-graphite-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              className="absolute top-1/2 right-0 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md"
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
                                    item.color === t('fleet.items.primavera.color') ? '#F9F7F1' :
                                    item.color === t('fleet.items.gts.color') ? '#9AA89C' : '#E9DCC9'
                                }}
                              ></div>
                            </div>
                            
                            <p className="mb-6 text-graphite-black/80">
                              {item.description}
                            </p>
                            
                            <div className="space-y-3 mb-6">
                              <h4 className="font-semibold text-sm text-graphite-black/70 uppercase tracking-wider">
                                {t('fleet.features')}
                              </h4>
                              <ul className="space-y-2">
                                {item.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-center text-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
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
                    <p className="text-white font-medium text-sm inline-block bg-sage-green/90 px-3 py-1 rounded-full">
                      {item.specs}
                    </p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-2xl font-bold font-syne">{item.name}</h3>
                      <p className="text-sage-green font-medium">{item.color}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full" style={{ backgroundColor: 
                      item.color === t('fleet.items.primavera.color') ? '#F9F7F1' :
                      item.color === t('fleet.items.gts.color') ? '#9AA89C' :
                      item.color === t('fleet.items.sprint.color') ? '#E9DCC9' : '#B0B0B0'
                    }}></div>
                  </div>
                  
                  <p className="mb-6 text-graphite-black/80">{item.description}</p>
                  
                  {/* Features list - always visible on desktop */}
                  <div className="space-y-2 mb-6">
                    <h4 className="font-semibold text-sm text-graphite-black/70 uppercase tracking-wider">{t('fleet.features')}</h4>
                    <ul className="space-y-1">
                      {item.features.map((feature, idx) => (
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