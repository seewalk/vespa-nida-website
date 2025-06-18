'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from './context/LanguageContext';
import ToggleButton from './ToggleButton';
import ToggleFAQButton from './ToggleFAQButton';
import SEO from './SEO';

export default function HeroSection() {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Enhanced device detection for mobile, tablet, and desktop
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    }
    
    // Set initial value
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBookingForm = () => {
    // This is only for desktop - for mobile we're using the scrollToId in ToggleButton
    if (!isMobile) {
      const element = document.getElementById('booking-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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

  // Dynamic container height based on device type - Enhanced for tablet text fitting
  const getContainerHeight = () => {
    if (isMobile) return "h-20"; // Mobile height
    if (isTablet) return "h-44 md:h-48"; // Significantly increased for tablet: h-44 (11rem/176px) to h-48 (12rem/192px)
    return "h-32 lg:h-40 xl:h-44"; // Desktop heights with extra large screen support
  };

  // Dynamic H1 classes based on device type - Enhanced tablet sizing
  const getH1Classes = () => {
    const baseClasses = "font-bold absolute w-full leading-tight";
    
    if (isMobile) {
      return `${baseClasses} text-2xl sm:text-3xl text-graphite-black`;
    }
    
    if (isTablet) {
      return `${baseClasses} text-4xl md:text-5xl`; // Increased from text-3xl md:text-4xl to text-4xl md:text-5xl
    }
    
    // Desktop classes with enhanced responsiveness
    return `${baseClasses} text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl`;
  };

  return (
    <>
      <SEO 
        title={t('hero.tagline')}
        description={t('hero.description')}
        keywords="vespa rental nida, premium scooter rental, lithuania tourism, curonian spit, baltic coast"
        ogImage="/images/hero-vespa-nida-2.png"
        section="home"
      />
      
      <section className="relative h-screen w-full flex items-center overflow-hidden">
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
              
              <div className={`${getContainerHeight()} overflow-hidden relative mb-8 text-center`}>
                {slogans.map((slogan, index) => (
                  <motion.h1
                    key={index}
                    className={getH1Classes()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: currentSloganIndex === index ? 1 : 0,
                      y: currentSloganIndex === index ? 0 : 20
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    {slogan}
                  </motion.h1>
                ))}
              </div>
              
              {/* Mobile buttons group with consistent spacing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col space-y-4 w-full"
              >
                {/* Explore Fleet Button (existing) */}
                <a 
                  href="#fleet" 
                  className="px-6 py-3 bg-graphite-black text-white rounded-lg font-medium hover:bg-graphite-black/90 transition-colors text-center"
                >
                  {t('hero.exploreFleet')}
                </a>
                
                {/* New FAQ Button */}
                <ToggleFAQButton 
                  text={t('hero.viewFAQ')}
                  scrollToId="faq"
                  delay={0.2}
                />
    
                {/* Reservation Button (existing) */}
                <ToggleButton 
                  isOpen={false} 
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  showText={t('booking.bookingShort')} 
                  hideText={t('booking.bookingShort')}
                  scrollToId="contact"
                  className="w-full"
                  delay={0.3}
                />
              </motion.div>
            </motion.div>
            
            {/* Decorative elements */}
            <div className="absolute bottom-10 w-16 h-16 rounded-full bg-sage-green/5"></div>
            <div className="absolute top-10 right-5 w-20 h-20 rounded-full bg-sand-beige/10"></div>
          </div>
        ) : (
          // Desktop/Tablet Version - Full Hero with Image Background
          <>
            <div className="absolute inset-0 z-0">
              <div className="relative h-full w-full">
                <Image
                  src="/images/hero-vespa-nida-2.png"
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
            
            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-xl xl:max-w-2xl text-ivory-white"
              >
                <motion.span 
                  className="inline-block font-syne uppercase tracking-wider text-sage-green mb-4 text-sm md:text-base lg:text-lg border-l-2 border-sage-green pl-3"
                >
                  {t('hero.tagline')}
                </motion.span>
                
                {/* Enhanced H1 container with better tablet support */}
                <div className={`${getContainerHeight()} overflow-hidden relative mb-6 md:mb-8`}>
                  {slogans.map((slogan, index) => (
                    <motion.h1
                      key={index}
                      className={getH1Classes()}
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
                  className="text-base md:text-lg lg:text-xl xl:text-2xl mb-6 md:mb-8 max-w-md lg:max-w-lg xl:max-w-xl text-white/90 leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  {t('hero.description')}
                </motion.p>
                
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 sm:items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <a 
                    href="#fleet" 
                    className="btn-primary text-sm md:text-base lg:text-lg inline-block px-6 md:px-8 py-3 md:py-4 text-center"
                  >
                    {t('hero.exploreFleet')}
                  </a>
                  
                  <button 
                    onClick={scrollToBookingForm}
                    className="text-white hover:text-sage-green transition-colors inline-flex items-center group text-sm md:text-base lg:text-lg"
                  >
                    <span className="mr-2">{t('booking.startBooking')}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 transform transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Scroll indicator */}
            <motion.div 
              className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 z-10 text-white flex flex-col items-center"
              initial="initial"
              animate="animate"
              variants={scrollIndicatorVariants}
            >
              <span className="text-xs md:text-sm mb-2 opacity-80">{t('hero.scrollToExplore')}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 md:h-6 md:w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
            
            {/* Decorative elements */}
            <div className="absolute top-1/3 right-6 md:right-10 h-24 w-24 md:h-32 md:w-32 border-r border-b border-white/10 hidden lg:block"></div>
            <div className="absolute bottom-16 md:bottom-20 left-6 md:left-10 h-16 w-16 md:h-20 md:w-20 border-l border-t border-white/10 hidden lg:block"></div>
          </>
        )}
      </section>
    </>
  );
}