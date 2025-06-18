'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useLanguage } from './context/LanguageContext';

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const autoplayTimeoutRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

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

  // Enhanced testimonials with existing translation paths
  const testimonials = [
    {
      id: 1,
      name: t('testimonials.items.0.name'),
      location: t('testimonials.items.0.location'),
      quote: t('testimonials.items.0.quote'),
      rating: 5,
      date: t('testimonials.items.0.date')
    },
    {
      id: 2,
      name: t('testimonials.items.1.name'),
      location: t('testimonials.items.1.location'),
      quote: t('testimonials.items.1.quote'),
      rating: 5,
      date: t('testimonials.items.1.date')
    },
    {
      id: 3,
      name: t('testimonials.items.2.name'),
      location: t('testimonials.items.2.location'),
      quote: t('testimonials.items.2.quote'),
      rating: 5,
      date: t('testimonials.items.2.date')
    },
    {
      id: 4,
      name: t('testimonials.items.3.name'),
      location: t('testimonials.items.3.location'),
      quote: t('testimonials.items.3.quote'),
      rating: 5,
      date: t('testimonials.items.3.date')
    },
    {
      id: 5,
      name: t('testimonials.items.4.name'),
      location: t('testimonials.items.4.location'),
      quote: t('testimonials.items.4.quote'),
      rating: 4,
      date: t('testimonials.items.4.date')
    }
  ];

  // Handle autoplay
  useEffect(() => {
    if (isAutoplay && isInView) {
      autoplayTimeoutRef.current = setTimeout(() => {
        setActive((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      }, 6000);
    }
    
    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, [active, isAutoplay, isInView, testimonials.length]);

  // Pause autoplay when user interacts with carousel
  const pauseAutoplay = () => {
    setIsAutoplay(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoplay(true), 10000);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActive(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
    pauseAutoplay();
  };

  const handleNext = () => {
    setDirection(1);
    setActive(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
    pauseAutoplay();
  };

  const jumpToTestimonial = (index) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
    pauseAutoplay();
  };

  // Animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  // Generate star rating display
  const renderStars = (rating) => {
    return (
      <div className="flex justify-center mb-6">
        {[...Array(5)].map((_, i) => (
          <motion.svg 
            key={i} 
            className={`w-5 h-5 ${i < rating ? 'text-amber-400' : 'text-sand-beige'}`}
            fill="currentColor" 
            viewBox="0 0 20 20"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * i }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </motion.svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-24 md:py-32 bg-white relative" ref={sectionRef}>
      {/* Minimal decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sage-green/3 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-sand-beige/3 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block font-syne uppercase tracking-wider text-sage-green mb-2 text-sm">{t('testimonials.subtitle')}</span>
          <h2 className="text-3xl md:text-5xl font-bold font-syne text-graphite-black">{t('testimonials.title')}</h2>
          <div className="w-24 h-1 bg-sage-green mx-auto mt-6 mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-graphite-black/70">
            {t('testimonials.description')}
          </p>
        </motion.div>
        
        {/* Minimalistic testimonial carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={active}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="text-center py-8 px-4 md:px-12"
                >
                  {/* Star rating */}
                  {renderStars(testimonials[active].rating)}
                  
                  {/* Quote */}
                  <div className="relative mb-8">
                    <svg className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-sage-green/10 w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <motion.p 
                      className="text-xl md:text-2xl italic text-graphite-black relative z-10 max-w-3xl mx-auto leading-relaxed"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      "{testimonials[active].quote}"
                    </motion.p>
                  </div>
                  
                  {/* Name and location */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-1"
                  >
                    <h3 className="font-syne font-bold text-xl text-graphite-black">
                      {testimonials[active].name}
                    </h3>
                    <p className="text-graphite-black/60">
                      {testimonials[active].location}
                    </p>
                    <p className="text-sm text-sage-green">
                      {testimonials[active].date}
                    </p>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation Arrows - Only show on hover for minimal design */}
            <motion.button 
              onClick={handlePrev}
              className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 md:-translate-x-8 bg-white/80 backdrop-blur-sm w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:bg-sage-green hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label={t('testimonials.prevButton')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            
            <motion.button 
              onClick={handleNext}
              className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 md:translate-x-8 bg-white/80 backdrop-blur-sm w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:bg-sage-green hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
              aria-label={t('testimonials.nextButton')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
            
            {/* Add group class to main container for hover effects */}
            <div className="group absolute inset-0 pointer-events-none"></div>
          </div>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-12 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => jumpToTestimonial(index)}
                className="group p-1"
                aria-label={`${t('testimonials.goToReview')} ${index + 1}`}
              >
                <motion.span
                  className={`block w-3 h-3 rounded-full transition-all duration-300 ${
                    active === index 
                      ? 'bg-sage-green scale-110' 
                      : 'bg-sage-green/20 group-hover:bg-sage-green/40'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              </button>
            ))}
          </div>
          
          {/* Autoplay indicator - minimal */}
          <div className="flex justify-center mt-6">
            <button 
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                isAutoplay ? 'bg-sage-green/10 text-sage-green' : 'bg-graphite-black/5 text-graphite-black/30'
              }`}
              onClick={() => setIsAutoplay(!isAutoplay)}
              aria-label={isAutoplay ? t('testimonials.pauseAutoplay') : t('testimonials.startAutoplay')}
            >
              {isAutoplay ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Add your own testimonial CTA - minimal */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-graphite-black/60 mb-4 text-sm">{t('testimonials.enjoyed')}</p>
            <a 
              href="#contact" 
              className="inline-flex items-center text-sage-green hover:text-sage-green/80 font-medium text-sm"
            >
              <span>{t('testimonials.shareYours')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}