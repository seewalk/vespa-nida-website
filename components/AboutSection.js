'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useLanguage } from './context/LanguageContext';

export default function AboutSection() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileContent, setShowMobileContent] = useState(false);
  
  // Check for mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Feature boxes data with translations
  const features = [
    {
      title: t('about.features.premium.title'),
      description: t('about.features.premium.description'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-3 text-sage-green mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: t('about.features.expertise.title'),
      description: t('about.features.expertise.description'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-3 text-sage-green mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      title: t('about.features.service.title'),
      description: t('about.features.service.description'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-3 text-sage-green mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="about" className="py-20 md:py-28 bg-white relative overflow-hidden" ref={sectionRef}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-28 h-28 border-l-4 border-t-4 border-sage-green/10 -translate-x-1/2 -translate-y-1/2 rounded-tl-3xl"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 border-r-4 border-b-4 border-sage-green/10 translate-x-1/2 translate-y-1/2 rounded-br-3xl"></div>
      
      <div className="container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block font-syne uppercase tracking-wider text-sage-green mb-2 text-sm">
            {t('about.subtitle')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-graphite-black">
            {t('about.title')}
          </h2>
          <div className="w-24 h-1 bg-sage-green mx-auto mt-6"></div>
        </motion.div>
        
        {isMobile ? (
          // Mobile linktree-style view
          <div className="flex flex-col items-center">
            {/* Button that shows/hides content */}
            <button 
              onClick={() => setShowMobileContent(!showMobileContent)}
              className="bg-sage-green text-white py-4 px-8 rounded-full flex items-center justify-center mb-6 shadow-md hover:shadow-lg transition-all duration-300 w-full max-w-xs"
            >
              <span className="mr-2">{showMobileContent ? t('about.hideContent') : t('about.showContent')}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-300 ${showMobileContent ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Circle image always visible */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6 }}
              className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-sand-beige shadow-lg mb-6"
            >
              <Image
                src="/images/badge.jpg"
                alt={t('about.imageAlt')}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
            
            {/* Expandable content */}
            <AnimatePresence>
              {showMobileContent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="text-center mb-8">
                    <p className="text-base leading-relaxed mb-4 text-graphite-black/80 px-4">
                      {t('about.paragraph1')}
                    </p>
                    <p className="text-base leading-relaxed mb-8 text-graphite-black/80 px-4">
                      {t('about.paragraph2')}
                    </p>
                    
                    <div className="flex flex-col gap-4 mb-6">
                      {features.map((feature, index) => (
                        <div 
                          key={feature.title}
                          className="bg-ivory-white p-4 rounded-lg text-center shadow-sm mx-4"
                        >
                          {feature.icon}
                          <h3 className="font-syne font-bold text-lg mb-1">{feature.title}</h3>
                          <p className="text-sm text-graphite-black/70">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-sage-green mr-3">&mdash;</span>
                      <p className="italic text-graphite-black/60">{t('about.quote')}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // Desktop version - Full content always visible
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* About image - now with animations and enhanced styling */}
            <div className="order-1 lg:order-2 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.9, rotate: -5 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative aspect-square rounded-full overflow-hidden border-8 border-sand-beige shadow-lg"
              >
                <Image
                  src="/images/badge.jpg"
                  alt={t('about.imageAlt')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
              
              {/* Decorative badge overlay */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-6 -right-6 bg-sage-green text-white rounded-full h-24 w-24 flex items-center justify-center font-syne font-bold text-center p-2 shadow-lg transform rotate-12"
              >
                {t('about.since')}<br/>2023
              </motion.div>
              
              {/* Decorative dots */}
              <div className="absolute -top-4 -left-4 w-20 h-20 flex flex-wrap gap-2 opacity-20">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-sage-green"></div>
                ))}
              </div>
            </div>
            
            {/* About content - with enhanced animations and styling */}
            <motion.div 
              className="order-2 lg:order-1"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <motion.div variants={itemVariants}>
                <p className="text-lg md:text-xl leading-relaxed mb-6 text-graphite-black/80">
                  {t('about.paragraph1')}
                </p>
              </motion.div>
              
              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl leading-relaxed mb-10 text-graphite-black/80"
              >
                {t('about.paragraph2')}
              </motion.p>
              
              <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div 
                    key={feature.title}
                    variants={itemVariants}
                    className="bg-ivory-white p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1"
                  >
                    {feature.icon}
                    <h3 className="font-syne font-bold text-xl mb-2">{feature.title}</h3>
                    <p className="text-sm text-graphite-black/70">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="mt-10 flex items-center"
              >
                <span className="text-sage-green mr-3">&mdash;</span>
                <p className="italic text-graphite-black/60">{t('about.quote')}</p>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}