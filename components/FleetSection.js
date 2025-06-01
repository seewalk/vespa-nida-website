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
  const sectionRef = useRef(null);
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

  // Auto-advance carousel on mobile
  useEffect(() => {
    if (isMobile) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isMobile, currentSlide]);

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
          <div className="relative px-4">
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
                    <div className="bg-ivory-white rounded-xl overflow-hidden shadow-md">
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
                        <button 
                          className="btn-primary w-full py-3 text-sm"
                          onClick={() => setActiveVespa(item.id)}
                        >
                          {t('fleet.buttons.reserveNow')}
                        </button>
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
                    <div className="relative h-48 overflow-hidden">
                      <Image 
                        src={fleetItems.find(item => item.id === activeVespa).image} 
                        alt={fleetItems.find(item => item.id === activeVespa).name}
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
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold font-syne">
                            {fleetItems.find(item => item.id === activeVespa).name}
                          </h3>
                          <p className="text-sage-green font-medium">
                            {fleetItems.find(item => item.id === activeVespa).color}
                          </p>
                        </div>
                        <div 
                          className="h-8 w-8 rounded-full" 
                          style={{ 
                            backgroundColor: fleetItems.find(item => item.id === activeVespa).color === t('fleet.items.primavera.color') ? '#F9F7F1' :
                            fleetItems.find(item => item.id === activeVespa).color === t('fleet.items.gts.color') ? '#9AA89C' : '#E9DCC9'
                          }}
                        ></div>
                      </div>
                      
                      <p className="mb-6 text-graphite-black/80">
                        {fleetItems.find(item => item.id === activeVespa).description}
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <h4 className="font-semibold text-sm text-graphite-black/70 uppercase tracking-wider">
                          {t('fleet.features')}
                        </h4>
                        <ul className="space-y-2">
                          {fleetItems.find(item => item.id === activeVespa).features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <button className="btn-primary w-full py-3">
                        {t('fleet.buttons.reserveNow')}
                      </button>
                    </div>
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
                className={`bg-ivory-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                  activeVespa === item.id ? 'ring-2 ring-sage-green' : ''
                }`}
                onClick={() => handleVespaClick(item.id)}
              >
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
                  
                  {/* Features list - visible when expanded on mobile or always on desktop */}
                  <motion.div 
                    className={`space-y-2 mb-6 ${activeVespa === item.id || !isMobile ? 'block' : 'hidden md:block'}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={activeVespa === item.id ? { opacity: 1, height: 'auto' } : {}}
                    transition={{ duration: 0.3 }}
                  >
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
                  </motion.div>
                  
                  <div className="flex space-x-4">
                    <button className="btn-primary flex-1 py-3">
                      {t('fleet.buttons.reserveNow')}
                    </button>
                    <button className="border border-sage-green text-sage-green py-3 px-4 rounded hover:bg-sage-green/10 transition-colors">
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
    </section>
  );
}
