'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useLanguage } from './context/LanguageContext';

export default function TestimonialsSection() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [direction, setDirection] = useState(1);
  const [expandedInfo, setExpandedInfo] = useState(false);
  const [showTestimonials, setShowTestimonials] = useState(false);
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

  // Enhanced testimonials with additional data and translations
  const testimonials = [
    {
      id: 1,
      name: t('testimonials.items.0.name'),
      location: t('testimonials.items.0.location'),
      quote: t('testimonials.items.0.quote'),
      image: "/images/testimonial-1.jpg",
      rating: 5,
      vespaModel: t('testimonials.items.0.vespaModel'),
      routeTaken: t('testimonials.items.0.routeTaken'),
      date: t('testimonials.items.0.date')
    },
    {
      id: 2,
      name: t('testimonials.items.1.name'),
      location: t('testimonials.items.1.location'),
      quote: t('testimonials.items.1.quote'),
      image: "/images/testimonial-2.jpg",
      rating: 5,
      vespaModel: t('testimonials.items.1.vespaModel'),
      routeTaken: t('testimonials.items.1.routeTaken'),
      date: t('testimonials.items.1.date')
    },
    {
      id: 3,
      name: t('testimonials.items.2.name'),
      location: t('testimonials.items.2.location'),
      quote: t('testimonials.items.2.quote'),
      image: "/images/testimonial-3.jpg",
      rating: 5,
      vespaModel: t('testimonials.items.2.vespaModel'),
      routeTaken: t('testimonials.items.2.routeTaken'),
      date: t('testimonials.items.2.date')
    },
    {
      id: 4,
      name: t('testimonials.items.3.name'),
      location: t('testimonials.items.3.location'),
      quote: t('testimonials.items.3.quote'),
      image: "/images/testimonial-1.jpg", // Using existing image as placeholder
      rating: 5,
      vespaModel: t('testimonials.items.3.vespaModel'),
      routeTaken: t('testimonials.items.3.routeTaken'),
      date: t('testimonials.items.3.date')
    },
    {
      id: 5,
      name: t('testimonials.items.4.name'),
      location: t('testimonials.items.4.location'),
      quote: t('testimonials.items.4.quote'),
      image: "/images/testimonial-2.jpg", // Using existing image as placeholder
      rating: 4,
      vespaModel: t('testimonials.items.4.vespaModel'),
      routeTaken: t('testimonials.items.4.routeTaken'),
      date: t('testimonials.items.4.date')
    }
  ];

  // Handle autoplay
  useEffect(() => {
    if (isAutoplay && isInView) {
      autoplayTimeoutRef.current = setTimeout(() => {
        setActive((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      }, 5000);
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
      <div className="flex justify-center">
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
    <section className="py-24 md:py-32 bg-sand-beige/10 relative" ref={sectionRef}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 right-0 text-sage-green/5 w-64 h-64" viewBox="0 0 200 200" fill="currentColor">
          <path d="M37.5,186.5c-50-50,50-100,50-150s100,0,100,50S87.5,136.5,37.5,186.5z" />
        </svg>
        <svg className="absolute bottom-0 left-0 text-sage-green/5 w-96 h-96" viewBox="0 0 200 200" fill="currentColor">
          <circle cx="100" cy="100" r="80" />
        </svg>
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
        
        {isMobile ? (
          // Mobile version with toggle button
          <div className="flex flex-col items-center">
            {/* Toggle Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => setShowTestimonials(!showTestimonials)}
              className="bg-sage-green text-white px-6 py-4 rounded-xl flex items-center justify-center mb-8 shadow-md w-full max-w-xs"
            >
              <span className="mr-2">
                {showTestimonials ? t('testimonials.hideReviews') : t('testimonials.viewReviews')}
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-300 ${showTestimonials ? 'transform rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
            
            {/* Featured Testimonial Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-xs mb-6"
            >
              <div className="aspect-square overflow-hidden rounded-xl shadow-md relative">
                <Image
                  src={testimonials[0].image}
                  alt={testimonials[0].name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <div className="mb-3">
                    {renderStars(testimonials[0].rating)}
                  </div>
                  <h3 className="font-syne font-bold text-lg text-white">{testimonials[0].name}</h3>
                  <p className="text-white/80 text-sm">{testimonials[0].location}</p>
                </div>
                <div className="absolute top-4 right-4 bg-sage-green/90 text-white text-xs px-3 py-1 rounded-full font-medium">
                  {testimonials[0].routeTaken}
                </div>
              </div>
            </motion.div>
            
            {/* Expandable Testimonials Carousel */}
            <AnimatePresence>
              {showTestimonials && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full overflow-hidden"
                >
                  {/* Simple Mobile Carousel */}
                  <div className="relative">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="p-4">
                        <div className="mb-4">
                          {renderStars(testimonials[active].rating)}
                        </div>
                        
                        <div className="relative">
                          <svg className="absolute -top-3 -left-2 text-sage-green/20 w-6 h-6 transform -scale-x-100" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                          <p className="text-base italic relative z-10 mb-4">
                            "{testimonials[active].quote}"
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-syne font-bold">{testimonials[active].name}</h3>
                            <p className="text-xs text-graphite-black/60">{testimonials[active].location}</p>
                          </div>
                          <span className="text-xs bg-sage-green/10 text-sage-green px-2 py-1 rounded">
                            {testimonials[active].date}
                          </span>
                        </div>
                        
                        {/* Expandable details */}
                        <button 
                          className="text-sage-green text-xs flex items-center"
                          onClick={() => setExpandedInfo(!expandedInfo)}
                        >
                          <span>
                            {expandedInfo ? t('testimonials.showLess') : t('testimonials.showDetails')}
                          </span>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-4 w-4 ml-1 transition-transform duration-300 ${expandedInfo ? 'rotate-180' : ''}`}
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        <AnimatePresence>
                          {expandedInfo && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-3 pt-3 border-t border-graphite-black/10"
                            >
                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                  <p className="text-graphite-black/60 mb-1">{t('testimonials.vespaModel')}</p>
                                  <p className="font-medium">{testimonials[active].vespaModel}</p>
                                </div>
                                <div>
                                  <p className="text-graphite-black/60 mb-1">{t('testimonials.routeTaken')}</p>
                                  <p className="font-medium">{testimonials[active].routeTaken}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    {/* Carousel Navigation */}
                    <div className="flex justify-between mt-4 mb-6">
                      <button 
                        onClick={handlePrev}
                        className="bg-white w-10 h-10 rounded-full shadow flex items-center justify-center hover:bg-sage-green hover:text-white transition-all duration-300"
                        aria-label={t('testimonials.prevButton')}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <div className="flex space-x-1">
                        {testimonials.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => jumpToTestimonial(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              active === index ? 'bg-sage-green' : 'bg-sage-green/30'
                            }`}
                            aria-label={`${t('testimonials.goToReview')} ${index + 1}`}
                          />
                        ))}
                      </div>
                      
                      <button 
                        onClick={handleNext}
                        className="bg-white w-10 h-10 rounded-full shadow flex items-center justify-center hover:bg-sage-green hover:text-white transition-all duration-300"
                        aria-label={t('testimonials.nextButton')}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Add your own testimonial CTA */}
                    <motion.div 
                      className="text-center mt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <p className="text-sm text-graphite-black/70 mb-3">{t('testimonials.enjoyed')}</p>
                      <a 
                        href="#contact" 
                        className="inline-flex items-center text-sage-green text-sm font-medium"
                      >
                        <span>{t('testimonials.shareYours')}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </a>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // Desktop version - full testimonial carousel
          <div className="max-w-5xl mx-auto">
            {/* Testimonials carousel */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                <div className="relative h-full">
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                      key={active}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="grid md:grid-cols-2"
                    >
                      {/* Image side */}
                      <div className="relative h-60 md:h-auto overflow-hidden">
                        <Image
                          src={testimonials[active].image}
                          alt={testimonials[active].name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                          <h3 className="font-syne font-bold text-xl">{testimonials[active].name}</h3>
                          <p className="text-sm opacity-80">{testimonials[active].location}</p>
                        </div>
                        
                        {/* Route taken badge */}
                        <div className="absolute top-4 right-4 bg-sage-green/90 text-white text-xs px-3 py-1 rounded-full font-medium">
                          {testimonials[active].routeTaken}
                        </div>
                      </div>
                      
                      {/* Content side */}
                      <div className="p-8 md:p-12 flex flex-col justify-between">
                        {/* Quote and rating */}
                        <div>
                          <div className="mb-4">
                            {renderStars(testimonials[active].rating)}
                          </div>
                          
                          <div className="relative">
                            <svg className="absolute -top-4 -left-3 text-sage-green/20 w-8 h-8 transform -scale-x-100" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                            <motion.p 
                              className="text-lg md:text-xl italic relative z-10"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            >
                              "{testimonials[active].quote}"
                            </motion.p>
                          </div>
                          
                          {/* Additional testimonial details */}
                          <motion.div 
                            className="mt-6 pt-4 border-t border-graphite-black/10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                          >
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-graphite-black/60 mb-1">{t('testimonials.vespaModel')}</p>
                                <p className="font-medium">{testimonials[active].vespaModel}</p>
                              </div>
                              <div>
                                <p className="text-graphite-black/60 mb-1">{t('testimonials.visitDate')}</p>
                                <p className="font-medium">{testimonials[active].date}</p>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                        
                        {/* Autoplay indicator */}
                        <div className="mt-6 flex items-center justify-between">
                          <div className="flex items-center">
                            <button 
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${isAutoplay ? 'bg-sage-green text-white' : 'bg-graphite-black/5 text-graphite-black/40'}`}
                              onClick={() => setIsAutoplay(!isAutoplay)}
                              aria-label={isAutoplay ? t('testimonials.pauseAutoplay') : t('testimonials.startAutoplay')}
                            >
                              {isAutoplay ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </button>
                            {isAutoplay && (
                              <div className="ml-3 flex items-center">
                                <span className="text-xs text-graphite-black/50">{t('testimonials.autoAdvancing')}</span>
                                <span className="ml-2 block w-3 h-3 rounded-full relative">
                                  <span className="absolute inset-0 rounded-full bg-sage-green opacity-60 animate-ping"></span>
                                  <span className="absolute inset-0 rounded-full bg-sage-green"></span>
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Pagination indicator */}
                          <div className="text-sm text-graphite-black/50">
                            {active + 1} / {testimonials.length}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Navigation Arrows */}
              <motion.button 
                onClick={handlePrev}
                className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-sage-green hover:text-white transition-all duration-300 z-10"
                aria-label={t('testimonials.prevButton')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <motion.button 
                onClick={handleNext}
                className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-sage-green hover:text-white transition-all duration-300 z-10"
                aria-label={t('testimonials.nextButton')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
            
            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => jumpToTestimonial(index)}
                  className="group p-1"
                  aria-label={`${t('testimonials.goToReview')} ${index + 1}`}
                >
                  <motion.span
                    className={`block w-2 h-2 rounded-full transition-all duration-300 ${
                      active === index 
                        ? 'bg-sage-green scale-125' 
                        : 'bg-sage-green/30 group-hover:bg-sage-green/50'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                </button>
              ))}
            </div>
            
            {/* Add your own testimonial CTA */}
            <motion.div 
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <p className="text-graphite-black/70 mb-4">{t('testimonials.enjoyed')}</p>
              <a 
                href="#contact" 
                className="inline-flex items-center text-sage-green hover:text-sage-green/80 font-medium"
              >
                <span>{t('testimonials.shareYours')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}