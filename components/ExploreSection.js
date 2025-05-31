'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';

export default function ExploreSection() {
  const [activeRoute, setActiveRoute] = useState(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  const routes = [
    {
      id: 1,
      title: "Coastal Lighthouse Route",
      distance: "12 km",
      duration: "45 min",
      difficulty: "Easy",
      description: "Follow the picturesque coastal road to the iconic Nida Lighthouse, offering panoramic views of the Baltic Sea and the Curonian Lagoon.",
      highlights: ["Panoramic sea views", "Historic lighthouse", "Sandy beaches", "Coastal wildlife"],
      image: "/images/nida-route.jpg" // Using the main image, but ideally each route would have its own
    },
    {
      id: 2,
      title: "Sand Dunes Adventure",
      distance: "18 km",
      duration: "1 hour",
      difficulty: "Moderate",
      description: "Wind through pine forests to reach the famous Parnidis Dune, the second highest moving sand dune in Europe. Perfect for sunset views.",
      highlights: ["Towering sand dunes", "Forest trails", "Sundial monument", "Sunset views"],
      image: "/images/nida-route.jpg" // Placeholder - would be replaced with specific route image
    },
    {
      id: 3,
      title: "Fisherman's Village Tour",
      distance: "8 km",
      duration: "30 min",
      difficulty: "Easy",
      description: "Discover the authentic charm of traditional Lithuanian fishing villages with their colorful wooden houses and rich maritime history.",
      highlights: ["Colorful houses", "Local crafts", "Fishing harbor", "Traditional architecture"],
      image: "/images/nida-route.jpg" // Placeholder - would be replaced with specific route image
    }
  ];

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-emerald-500';
      case 'Moderate': return 'bg-amber-500';
      case 'Hard': return 'bg-rose-500';
      default: return 'bg-sage-green';
    }
  };

  // Get difficulty icon
  const getDifficultyIcon = (difficulty) => {
    switch(difficulty) {
      case 'Easy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        );
      case 'Moderate':
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
          <span className="inline-block font-syne uppercase tracking-wider text-sage-green mb-2 text-sm">Curated Journeys</span>
          <h2 className="text-3xl md:text-5xl font-bold font-syne text-graphite-black">Explore Nida</h2>
          <div className="w-24 h-1 bg-sage-green mx-auto mt-6 mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-graphite-black/70">
            Discover the natural beauty and cultural heritage of the Curonian Spit with our expertly designed scenic routes. 
            Each journey offers a unique perspective of Nida's breathtaking landscapes and hidden gems.
          </p>
        </motion.div>
        
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
                alt="Map of scenic routes in Nida"
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
                <h4 className="font-syne font-semibold text-sm mb-2">Difficulty Level</h4>
                <div className="flex gap-3">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span className="text-xs">Easy</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-xs">Moderate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="text-xs">Hard</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white shadow-lg rounded-lg p-4 max-w-xs">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-syne font-semibold">Tip for Explorers</span>
              </div>
              <p className="text-sm text-graphite-black/70">
                All routes begin from our central location. GPS guides available on request for self-guided tours.
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
                        <h4 className="font-semibold text-sm uppercase tracking-wider mb-2 text-graphite-black/70">Route Highlights</h4>
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
                              <span className="font-medium mr-2">Terrain:</span>
                              <span className="text-sm text-graphite-black/70">
                                {route.difficulty === 'Easy' ? 'Paved roads, flat terrain' : 
                                 route.difficulty === 'Moderate' ? 'Mixed terrain, some inclines' : 
                                 'Varied terrain, steep sections'}
                              </span>
                            </div>
                            <button className="text-sage-green hover:text-sage-green/80 font-medium text-sm flex items-center">
                              <span>View Details</span>
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
                    <span>{activeRoute === route.id ? 'Show Less' : 'Show More'}</span>
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
                View All Routes
              </a>
              <p className="text-sm text-graphite-black/60 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Custom routes available upon request
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}