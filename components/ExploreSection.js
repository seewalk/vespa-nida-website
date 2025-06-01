'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useLanguage } from './context/LanguageContext';

export default function ExploreSection() {
  const { t } = useLanguage();
  const [activeRoute, setActiveRoute] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
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
  
  const routes = [
    {
      id: 1,
      title: t('explore.routes.coastal.title'),
      distance: t('explore.routes.coastal.distance'),
      duration: t('explore.routes.coastal.duration'),
      difficulty: t('explore.routes.coastal.difficulty'),
      description: t('explore.routes.coastal.description'),
      highlights: [
        t('explore.routes.coastal.highlights.0'),
        t('explore.routes.coastal.highlights.1'),
        t('explore.routes.coastal.highlights.2'),
        t('explore.routes.coastal.highlights.3')
      ],
      image: "/images/nida-route.jpg",
      terrain: t('explore.routes.coastal.terrain')
    },
    {
      id: 2,
      title: t('explore.routes.dunes.title'),
      distance: t('explore.routes.dunes.distance'),
      duration: t('explore.routes.dunes.duration'),
      difficulty: t('explore.routes.dunes.difficulty'),
      description: t('explore.routes.dunes.description'),
      highlights: [
        t('explore.routes.dunes.highlights.0'),
        t('explore.routes.dunes.highlights.1'),
        t('explore.routes.dunes.highlights.2'),
        t('explore.routes.dunes.highlights.3')
      ],
      image: "/images/nida-route.jpg",
      terrain: t('explore.routes.dunes.terrain')
    },
    {
      id: 3,
      title: t('explore.routes.fisherman.title'),
      distance: t('explore.routes.fisherman.distance'),
      duration: t('explore.routes.fisherman.duration'),
      difficulty: t('explore.routes.fisherman.difficulty'),
      description: t('explore.routes.fisherman.description'),
      highlights: [
        t('explore.routes.fisherman.highlights.0'),
        t('explore.routes.fisherman.highlights.1'),
        t('explore.routes.fisherman.highlights.2'),
        t('explore.routes.fisherman.highlights.3')
      ],
      image: "/images/nida-route.jpg",
      terrain: t('explore.routes.fisherman.terrain')
    }
  ];

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    const easyText = t('explore.difficulty.easy');
    const moderateText = t('explore.difficulty.moderate');
    const hardText = t('explore.difficulty.hard');
    
    switch(difficulty) {
      case easyText: return 'bg-emerald-500';
      case moderateText: return 'bg-amber-500';
      case hardText: return 'bg-rose-500';
      default: return 'bg-sage-green';
    }
  };

  // Get difficulty icon
  const getDifficultyIcon = (difficulty) => {
    const easyText = t('explore.difficulty.easy');
    const moderateText = t('explore.difficulty.moderate');
    
    switch(difficulty) {
      case easyText:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        );
      case moderateText:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
    }
  };

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

  // Handle route card click
  const handleRouteClick = (id) => {
    setActiveRoute(activeRoute === id ? null : id);
  };

  return (
    <section id="explore" className="py-20 md:py-32 bg-sand-beige/10 relative" ref={sectionRef}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 left-0 text-sage-green/5" width="400" height="400" viewBox="0 0 100 100" fill="currentColor">
          <path d="M0,0 L100,0 L100,100 L0,100 Z" />
        </svg>
        <svg className="absolute bottom-0 right-0 text-sage-green/5" width="300" height="300" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="50" />
        </svg>
      </div>
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block font-syne uppercase tracking-wider text-sage-green mb-2 text-sm">{t('explore.subtitle')}</span>
          <h2 className="text-3xl md:text-5xl font-bold font-syne text-graphite-black">{t('explore.title')}</h2>
          <div className="w-24 h-1 bg-sage-green mx-auto mt-6 mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-graphite-black/70">
            {t('explore.description')}
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
              onClick={() => setShowContent(!showContent)}
              className="bg-sage-green text-white px-6 py-4 rounded-xl flex items-center justify-center mb-6 shadow-md w-full max-w-xs"
            >
              <span className="mr-2">{showContent ? t('explore.hideRoutes') : t('explore.viewRoutes')}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-300 ${showContent ? 'transform rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
            
            {/* Map Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-xs mb-6"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/images/nida-route.jpg"
                  alt={t('explore.mapAlt')}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                {/* Simplified map markers */}
                {routes.map((route, index) => (
                  <div 
                    key={route.id}
                    className={`absolute w-8 h-8 rounded-full border-2 border-white/70 flex items-center justify-center shadow-lg`}
                    style={{ 
                      top: `${20 + index * 25}%`, 
                      left: `${15 + index * 30}%`,
                      backgroundColor: getDifficultyColor(route.difficulty),
                    }}
                  >
                    <span className="font-bold text-white text-xs">{route.id}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Expandable Content */}
            <AnimatePresence>
              {showContent && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full overflow-hidden"
                >
                  <div className="space-y-4">
                    {routes.map((route) => (
                      <motion.div 
                        key={route.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                          activeRoute === route.id ? 'ring-2 ring-sage-green' : ''
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold font-syne">{route.title}</h3>
                            <div className={`flex items-center px-2 py-1 rounded-full text-white text-xs ${getDifficultyColor(route.difficulty)}`}>
                              {getDifficultyIcon(route.difficulty)}
                              <span className="ml-1">{route.difficulty}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-3 mb-3 text-xs text-graphite-black/60">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{route.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                              <span>{route.distance}</span>
                            </div>
                          </div>
                          
                          <p className="text-graphite-black/80 text-sm mb-3">{route.description}</p>
                          
                          {/* Toggle details button */}
                          <button 
                            className="w-full flex items-center justify-center text-sage-green text-xs font-medium"
                            onClick={() => handleRouteClick(route.id)}
                          >
                            <span>{activeRoute === route.id ? t('explore.showLess') : t('explore.showMore')}</span>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-3 w-3 ml-1 transition-transform duration-300 ${
                                activeRoute === route.id ? 'transform rotate-180' : ''
                              }`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {/* Expanded details */}
                          <AnimatePresence>
                            {activeRoute === route.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-3 pt-3 border-t border-graphite-black/10"
                              >
                                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 text-graphite-black/70">
                                  {t('explore.routeHighlights')}
                                </h4>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                  {route.highlights.map((highlight, idx) => (
                                    <div key={idx} className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      <span className="text-xs">{highlight}</span>
                                    </div>
                                  ))}
                                </div>
                                
                                <div className="text-xs">
                                  <span className="font-medium mr-1">{t('explore.terrain')}:</span>
                                  <span className="text-graphite-black/70">{route.terrain}</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 text-center"
                    >
                      <a href="#contact" className="btn-primary inline-block text-center text-sm px-6 py-3">
                        {t('explore.viewAllRoutes')}
                      </a>
                      <p className="text-xs text-graphite-black/60 mt-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t('explore.customRoutesAvailable')}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // Desktop version
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Route Map Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                <Image
                  src="/images/nida-route.jpg"
                  alt={t('explore.mapAlt')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                {/* Map route markers - positioned approximately where routes would be */}
                {routes.map((route, index) => (
                  <motion.div 
                    key={route.id}
                    className={`absolute w-10 h-10 rounded-full border-4 ${
                      activeRoute === route.id ? 'border-white scale-110' : 'border-white/70'
                    } flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg`}
                    style={{ 
                      top: `${20 + index * 25}%`, 
                      left: `${15 + index * 30}%`,
                      backgroundColor: getDifficultyColor(route.difficulty),
                    }}
                    whileHover={{ scale: 1.15 }}
                    onClick={() => handleRouteClick(route.id)}
                  >
                    <span className="font-bold text-white">{route.id}</span>
                  </motion.div>
                ))}
                
                {/* Map legend */}
                <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-md">
                  <h4 className="font-syne font-semibold text-sm mb-2">{t('explore.difficultyLevel')}</h4>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                      <span className="text-xs">{t('explore.difficulty.easy')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                      <span className="text-xs">{t('explore.difficulty.moderate')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                      <span className="text-xs">{t('explore.difficulty.hard')}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white shadow-lg rounded-lg p-4 max-w-xs">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-syne font-semibold">{t('explore.tipForExplorers')}</span>
                </div>
                <p className="text-sm text-graphite-black/70">
                  {t('explore.tipDescription')}
                </p>
              </div>
            </motion.div>
            
            {/* Route List */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="space-y-6"
            >
              {routes.map((route) => (
                <motion.div 
                  key={route.id}
                  variants={itemVariants}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                    activeRoute === route.id ? 'ring-2 ring-sage-green' : ''
                  }`}
                  onClick={() => handleRouteClick(route.id)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold font-syne">{route.title}</h3>
                      <div className={`flex items-center px-2 py-1 rounded-full text-white text-xs ${getDifficultyColor(route.difficulty)}`}>
                        {getDifficultyIcon(route.difficulty)}
                        <span className="ml-1">{route.difficulty}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-graphite-black/60">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{route.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span>{route.distance}</span>
                      </div>
                    </div>
                    
                    <p className="text-graphite-black/80 mb-4">{route.description}</p>
                    
                    {/* Route highlights - visible when expanded */}
                    <AnimatePresence>
                      {activeRoute === route.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mb-4"
                        >
                          <h4 className="font-semibold text-sm uppercase tracking-wider mb-2 text-graphite-black/70">{t('explore.routeHighlights')}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {route.highlights.map((highlight, idx) => (
                              <div key={idx} className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-sm">{highlight}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-graphite-black/10">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span className="font-medium mr-2">{t('explore.terrain')}:</span>
                                <span className="text-sm text-graphite-black/70">{route.terrain}</span>
                              </div>
                              <button className="text-sage-green hover:text-sage-green/80 font-medium text-sm flex items-center">
                                <span>{t('explore.viewDetails')}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Click for more / less */}
                    <button 
                      className="w-full flex items-center justify-center text-sage-green hover:text-sage-green/80 text-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRouteClick(route.id);
                      }}
                    >
                      <span>{activeRoute === route.id ? t('explore.showLess') : t('explore.showMore')}</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-4 w-4 ml-1 transition-transform duration-300 ${
                          activeRoute === route.id ? 'transform rotate-180' : ''
                        }`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
              
              <motion.div variants={itemVariants} className="mt-8">
                <a href="#contact" className="btn-primary inline-block text-center">
                  {t('explore.viewAllRoutes')}
                </a>
                <p className="text-sm text-graphite-black/60 mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('explore.customRoutesAvailable')}
                </p>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}