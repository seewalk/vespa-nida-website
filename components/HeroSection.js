'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from './context/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Slogan rotation
  const slogans = [
    t('hero.slogans.first'),
    t('hero.slogans.second'),
    t('hero.slogans.third')
  ];

  const [currentSloganIndex, setCurrentSloganIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSloganIndex((prevIndex) => 
        prevIndex === slogans.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slogan every 5 seconds

    return () => clearInterval(interval);
  }, [slogans.length]);

  // Scroll indicator animation
  const scrollIndicatorVariants = {
    initial: { opacity: 0, y: 0 },
    animate: { 
      opacity: [0, 1, 0],
      y: [0, 10, 20],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop"
      }
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden">
      {/* Mobile Version - Only Logo and Minimal Text */}
      {isMobile ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-ivory-white z-10 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <Image 
              src="/images/logo.jpg" 
              alt="Vespa Nida Logo" 
              width={240} 
              height={80} 
              priority
              className="mb-8"
            />
            
            <div className="h-16 overflow-hidden relative mb-8 text-center">
              {slogans.map((slogan, index) => (
                <motion.h2
                  key={index}
                  className="text-xl font-bold absolute w-full text-graphite-black"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: currentSloganIndex === index ? 1 : 0,
                    y: currentSloganIndex === index ? 0 : 20
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {slogan}
                </motion.h2>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <a 
                href="#fleet" 
                className="btn-primary text-sm px-6 py-3 inline-block"
              >
                {t('hero.exploreFleet')}
              </a>
            </motion.div>
          </motion.div>
          
          {/* Simple decorative elements for mobile */}
          <div className="absolute bottom-10 w-16 h-16 rounded-full bg-sage-green/5"></div>
          <div className="absolute top-10 right-5 w-20 h-20 rounded-full bg-sand-beige/10"></div>
        </div>
      ) : (
        // Desktop Version - Full Hero with Image Background
        <>
          <div className="absolute inset-0 z-0">
            <div className="relative h-full w-full">
              <Image
                src="/images/hero-vespa.jpg"
                alt={t('hero.imageAlt')}
                fill
                priority
                sizes="100vw"
                className="object-cover"
                style={{ 
                  transform: `scale(${1 + scrollY * 0.0005})`,
                  transformOrigin: 'center center' 
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-graphite-black/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl text-ivory-white"
            >
              <motion.span 
                className="inline-block font-syne uppercase tracking-wider text-sage-green mb-4 text-sm md:text-base border-l-2 border-sage-green pl-3"
              >
                {t('hero.tagline')}
              </motion.span>
              
              <div className="h-24 md:h-32 lg:h-40 overflow-hidden relative">
                {slogans.map((slogan, index) => (
                  <motion.h1
                    key={index}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold absolute w-full"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ 
                      opacity: currentSloganIndex === index ? 1 : 0,
                      y: currentSloganIndex === index ? 0 : 40
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {slogan}
                  </motion.h1>
                ))}
              </div>
              
              <motion.p 
                className="text-lg md:text-xl mb-8 max-w-md text-white/90"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                {t('hero.description')}
              </motion.p>
              
              <motion.div
                className="flex flex-col md:flex-row gap-4 md:items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <a 
                  href="#fleet" 
                  className="btn-primary text-base inline-block px-8 py-4 text-center"
                >
                  {t('hero.exploreFleet')}
                </a>
                <a 
                  href="#contact" 
                  className="text-white hover:text-sage-green transition-colors inline-flex items-center group"
                >
                  <span className="mr-2">{t('hero.contactUs')}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 transform transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 text-white flex flex-col items-center"
            initial="initial"
            animate="animate"
            variants={scrollIndicatorVariants}
          >
            <span className="text-sm mb-2 opacity-80">{t('hero.scrollToExplore')}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/3 right-10 h-32 w-32 border-r border-b border-white/10 hidden lg:block"></div>
          <div className="absolute bottom-20 left-10 h-20 w-20 border-l border-t border-white/10 hidden lg:block"></div>
        </>
      )}
    </section>
  );
}