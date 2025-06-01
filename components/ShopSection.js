'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useLanguage } from './context/LanguageContext';

export default function ShopSection() {
  const { t } = useLanguage();
  const [showProducts, setShowProducts] = useState(false);
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
  
  const products = [
    {
      id: 1,
      name: t('shop.products.helmet.name'),
      price: t('shop.products.helmet.price'),
      image: "/images/vespa-helmet.jpg",
      category: t('shop.categories.safety')
    },
    {
      id: 2,
      name: t('shop.products.seat.name'),
      price: t('shop.products.seat.price'),
      image: "/images/vespa-seat.jpg",
      category: t('shop.categories.accessories')
    },
    {
      id: 3,
      name: t('shop.products.mirrors.name'),
      price: t('shop.products.mirrors.price'),
      image: "/images/mirrors.jpg",
      category: t('shop.categories.parts')
    },
    {
      id: 4,
      name: t('shop.products.map.name'),
      price: t('shop.products.map.price'),
      image: "/images/nida-map.jpg",
      category: t('shop.categories.lifestyle')
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section id="shop" className="py-24 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block font-syne uppercase tracking-wider text-sage-green mb-2 text-sm">
            {t('shop.subtitle')}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-syne text-graphite-black">
            {t('shop.title')}
          </h2>
          <div className="w-24 h-1 bg-sage-green mx-auto mt-6 mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-graphite-black/70">
            {t('shop.description')}
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
              onClick={() => setShowProducts(!showProducts)}
              className="bg-sage-green text-white px-6 py-4 rounded-xl flex items-center justify-center mb-8 shadow-md w-full max-w-xs"
            >
              <span className="mr-2">
                {showProducts ? t('shop.hideProducts') : t('shop.viewProducts')}
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform duration-300 ${showProducts ? 'transform rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>
            
            {/* Featured Product Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-xs mb-6"
            >
              <div className="aspect-square overflow-hidden rounded-xl shadow-md">
                <Image
                  src={products[0].image}
                  alt={products[0].name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm opacity-80">{products[0].category}</p>
                      <h3 className="font-bold text-lg">{products[0].name}</h3>
                    </div>
                    <span className="font-bold text-lg">{products[0].price}</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Expandable Product List */}
            <AnimatePresence>
              {showProducts && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {products.slice(1).map((product) => (
                      <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="group"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-lg mb-2">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 50vw, 33vw"
                          />
                        </div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-sm">{product.name}</h3>
                            <p className="text-xs text-sage-green">{product.category}</p>
                          </div>
                          <span className="font-bold text-sm">{product.price}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 text-center"
                  >
                    <button className="btn-primary text-sm px-6 py-3">
                      {t('shop.visitOnlineShop')}
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // Desktop version
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {products.map((product) => (
                <motion.div 
                  key={product.id} 
                  className="group"
                  variants={itemVariants}
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <p className="text-sm text-sage-green">{product.category}</p>
                    </div>
                    <span className="font-bold">{product.price}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="btn-primary">{t('shop.visitOnlineShop')}</button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}