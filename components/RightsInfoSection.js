'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useLanguage } from './context/LanguageContext';
import SEO from './SEO';

export default function RightsInfoSection() {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  // Check for mobile and handle resize
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Rights data with icons and translations
  const rightsData = [
    {
      id: "cancellation",
      title: t('rights.cancellation.title'),
      description: t('rights.cancellation.description'),
      badge: t('rights.cancellation.badge'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: "bg-green-500"
    },
    {
      id: "refund",
      title: t('rights.refund.title'),
      description: t('rights.refund.description'),
      badge: t('rights.refund.badge'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: "bg-blue-500"
    },
    {
      id: "weather",
      title: t('rights.weather.title'),
      description: t('rights.weather.description'),
      badge: t('rights.weather.badge'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      color: "bg-amber-500"
    },
    {
      id: "privacy",
      title: t('rights.privacy.title'),
      description: t('rights.privacy.description'),
      badge: t('rights.privacy.badge'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: "bg-purple-500"
    }
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <>
      <SEO 
        title={t('rights.title')}
        description={t('rights.description')}
        keywords="EU rights, vespa rental rights, consumer protection, GDPR, cancellation policy, refund policy"
        ogImage="/images/eu-rights-vespa.jpg"
        section="rights"
      />
      
      <section id="rights" className="py-24 bg-gradient-to-br from-ivory-white to-sand-beige/20 relative overflow-hidden" ref={sectionRef}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-sage-green/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-sage-green/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sage-green/3 rounded-full blur-3xl"></div>
        </div>
        
        {/* EU Stars Pattern */}
        <div className="absolute top-10 right-10 opacity-10">
          <div className="flex items-center justify-center w-20 h-20">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-sage-green rounded-full"
                style={{
                  transform: `rotate(${i * 30}deg) translateY(-30px)`,
                  transformOrigin: 'center'
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="container relative z-10">
          <motion.header 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-4">
              <span className="inline-block font-syne uppercase tracking-wider text-sage-green text-sm mr-3">
                {t('rights.subtitle')}
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-8 h-5 bg-blue-600 rounded-sm flex items-center justify-center">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-0.5 h-0.5 bg-yellow-400 rounded-full text-xs" />
                  ))}
                </div>
                <span className="text-xs text-sage-green font-medium">EU</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold font-syne text-graphite-black mb-6">
              {t('rights.title')}
            </h1>
            <div className="w-24 h-1 bg-sage-green mx-auto mb-8"></div>
            <p className="max-w-3xl mx-auto text-lg text-graphite-black/70">
              {t('rights.description')}
            </p>
          </motion.header>
          
          {/* Alternative Mobile layout - Enhanced 2x2 with better spacing */}
{isMobile ? (
  <div className="px-2">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="grid grid-cols-2 gap-3"
    >
      {rightsData.map((right, index) => (
        <motion.article 
          key={right.id}
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-md overflow-hidden relative min-h-[180px] flex flex-col hover:shadow-lg transition-shadow duration-300"
          whileTap={{ scale: 0.98 }}
        >
          {/* Mobile badge - positioned better */}
          <motion.div
            variants={badgeVariants}
            className={`absolute top-3 right-3 ${right.color} text-white text-[10px] font-bold px-2 py-1 rounded-full transform rotate-12 shadow-sm z-10`}
          >
            {right.badge}
          </motion.div>
          
          <div className="p-4 flex flex-col h-full justify-between">
            {/* Icon section */}
            <div className="flex flex-col items-center text-center mb-3">
              <div className="w-12 h-12 rounded-xl bg-sage-green/10 flex items-center justify-center mb-2">
                <div className="scale-90">
                  {right.icon}
                </div>
              </div>
              
              {/* Title */}
              <h3 className="font-syne font-bold text-sm text-graphite-black leading-tight">
                {right.title}
              </h3>
            </div>
            
            {/* Description */}
            <p className="text-xs text-graphite-black/70 leading-relaxed text-center mt-auto">
              {right.description}
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-sage-green to-sage-green/50"></div>
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sage-green/20 to-transparent opacity-50"></div>
        </motion.article>
      ))}
    </motion.div>
  </div>
) : (
            /* Desktop layout - 2x2 grid */
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
            >
              {rightsData.map((right, index) => (
                <motion.article 
                  key={right.id}
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden relative group transform hover:-translate-y-2"
                >
                  {/* Desktop badge */}
                  <motion.div
                    variants={badgeVariants}
                    className={`absolute top-6 right-6 ${right.color} text-white text-sm font-bold px-4 py-2 rounded-full transform rotate-12 shadow-lg z-10 group-hover:rotate-6 transition-transform duration-300`}
                  >
                    {right.badge}
                  </motion.div>
                  
                  <div className="p-8">
                    <div className="flex items-start mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-sage-green/10 flex items-center justify-center flex-shrink-0 mr-6 group-hover:bg-sage-green/20 transition-colors duration-300">
                        {right.icon}
                      </div>
                      <div className="flex-1 pr-6">
                        <h3 className="font-syne font-bold text-xl text-graphite-black mb-3 group-hover:text-sage-green transition-colors duration-300">
                          {right.title}
                        </h3>
                        <p className="text-base text-graphite-black/70 leading-relaxed">
                          {right.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Desktop decorative elements */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-sage-green to-sage-green/50 group-hover:h-2 transition-all duration-300"></div>
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-sage-green/20 to-transparent"></div>
                </motion.article>
              ))}
            </motion.div>
          )}
          
          {/* Footer note */}
          <motion.footer 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto border border-sage-green/10">
              <div className="flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sage-green mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-syne font-bold text-lg text-graphite-black">
                  {t('rights.footer.title')}
                </h4>
              </div>
              <p className="text-sm text-graphite-black/70 mb-4">
                {t('rights.footer.description')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <a 
                  href="mailto:info@vespanida.lt" 
                  className="flex items-center text-sage-green hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@vespanida.lt
                </a>
                <span className="hidden sm:inline text-graphite-black/30">|</span>
                <a 
                  href="tel:+37067956380" 
                  className="flex items-center text-sage-green hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +370 679 56380
                </a>
              </div>
            </div>
          </motion.footer>
        </div>
      </section>
    </>
  );
}