'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';

export default function FleetSection() {
  const [activeVespa, setActiveVespa] = useState(null);
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
      name: 'Vespa Primavera',
      color: 'Ivory White',
      description: 'Classic Italian styling with modern comfort. Perfect for coastal cruising.',
      image: '/images/fleet-white-vespa.jpg',
      specs: '150cc | Automatic | 2 Passengers',
      features: ['Fuel-efficient engine', 'Front disc brake', 'USB charging port', 'Under-seat storage']
    },
    {
      id: 2,
      name: 'Vespa GTS',
      color: 'Sage Green',
      description: 'Powerful performance with timeless elegance. Ideal for longer journeys.',
      image: '/images/fleet-green-vespa.jpg',
      specs: '300cc | Automatic | 2 Passengers',
      features: ['High-performance engine', 'ABS braking system', 'Digital dashboard', 'Spacious storage']
    },
    {
      id: 3,
      name: 'Vespa Sprint',
      color: 'Sand Beige',
      description: 'Nimble handling with refined aesthetics. Great for exploring narrow streets.',
      image: '/images/fleet-beige-vespa.jpg',
      specs: '125cc | Automatic | 2 Passengers',
      features: ['Agile handling', 'LED lighting', 'Anti-theft system', 'Comfortable seating']
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
          <span className="inline-block font-syne uppercase tracking-wider text-sage-green mb-2 text-sm">Explore our collection</span>
          <h2 className="text-3xl md:text-5xl font-bold font-syne text-graphite-black">Our Vespa Fleet</h2>
          <div className="w-24 h-1 bg-sage-green mx-auto mt-6 mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-graphite-black/70">
            Choose from our carefully selected fleet of premium Vespa scooters, 
            each maintained to the highest standards and ready for your Nida adventure.
          </p>
        </motion.div>
        
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
                    item.color === 'Ivory White' ? '#F9F7F1' :
                    item.color === 'Sage Green' ? '#9AA89C' :
                    item.color === 'Sand Beige' ? '#E9DCC9' : '#B0B0B0'
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
                  <h4 className="font-semibold text-sm text-graphite-black/70 uppercase tracking-wider">Features</h4>
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
                    Reserve Now
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
        
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-graphite-black/70 mb-6">Need a custom rental or have special requirements?</p>
          <a href="#contact" className="inline-flex items-center text-sage-green hover:text-sage-green/80 font-medium">
            <span>Contact our team for details</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}