'use client';

import { useState, useRef, useEffect } from 'react'; // Add useEffect here
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useLanguage } from './context/LanguageContext';

export default function FAQSection() {
  const { t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState(null);
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
  
  // FAQ items data
  const faqItems = [
    {
      question: t('faq.questions.q1'),
      answer: t('faq.answers.a1'),
      category: "booking"
    },
    {
      question: t('faq.questions.q2'),
      answer: t('faq.answers.a2'),
      category: "booking"
    },
    {
      question: t('faq.questions.q3'),
      answer: t('faq.answers.a3'),
      category: "requirements"
    },
    {
      question: t('faq.questions.q4'),
      answer: t('faq.answers.a4'),
      category: "requirements"
    },
    {
      question: t('faq.questions.q5'),
      answer: t('faq.answers.a5'),
      category: "rental"
    },
    {
      question: t('faq.questions.q6'),
      answer: t('faq.answers.a6'),
      category: "rental"
    },
    {
      question: t('faq.questions.q7'),
      answer: t('faq.answers.a7'),
      category: "safety"
    },
    {
      question: t('faq.questions.q8'),
      answer: t('faq.answers.a8'),
      category: "safety"
    }
  ];
  
  // Filter categories
  const [activeCategory, setActiveCategory] = useState("all");
  
  const categories = [
    { id: "all", name: t('faq.categories.all') },
    { id: "booking", name: t('faq.categories.booking') },
    { id: "requirements", name: t('faq.categories.requirements') },
    { id: "rental", name: t('faq.categories.rental') },
    { id: "safety", name: t('faq.categories.safety') }
  ];
  
  // Filter FAQ items based on active category
  const filteredFAQs = activeCategory === "all" 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);
  
  // Toggle FAQ item
  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
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
    <section id="faq" className="py-24 bg-ivory-white relative" ref={sectionRef}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sage-green/5 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sage-green/5 rounded-full"></div>
      </div>
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block font-syne uppercase tracking-wider text-sage-green mb-2 text-sm">{t('faq.subtitle')}</span>
          <h2 className="text-3xl md:text-5xl font-bold font-syne text-graphite-black">{t('faq.title')}</h2>
          <div className="w-24 h-1 bg-sage-green mx-auto mt-6 mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-graphite-black/70">
            {t('faq.description')}
          </p>
        </motion.div>
        
        {/* FAQ Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 text-sm rounded-lg transition-all ${
                activeCategory === category.id
                  ? 'bg-sage-green text-white shadow-sm'
                  : 'bg-sand-beige/30 text-graphite-black hover:bg-sand-beige/50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </motion.div>
        
        {/* Mobile layout */}
        {isMobile && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-4"
          >
            {filteredFAQs.map((item, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full px-5 py-4 text-left flex items-center justify-between transition-colors ${
                    expandedIndex === index ? 'bg-sage-green/5' : 'hover:bg-sage-green/5'
                  }`}
                >
                  <span className="font-syne font-medium">{item.question}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 text-sage-green transition-transform duration-300 ${
                      expandedIndex === index ? 'transform rotate-180' : ''
                    }`}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-4 pt-2 text-sm text-graphite-black/80"
                    >
                      <p>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Desktop layout - two columns */}
        {!isMobile && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {filteredFAQs.map((item, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full px-6 py-5 text-left flex items-center justify-between transition-colors ${
                    expandedIndex === index ? 'bg-sage-green/5' : 'hover:bg-sage-green/5'
                  }`}
                >
                  <span className="font-syne font-medium text-lg">{item.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    expandedIndex === index ? 'bg-sage-green text-white' : 'bg-sage-green/10 text-sage-green'
                  }`}>
                    {expandedIndex === index ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-5 pt-1"
                    >
                      <p className="text-graphite-black/70">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Still have questions CTA */}
        <motion.div 
          className="mt-16 bg-sand-beige/30 rounded-xl p-8 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl md:text-2xl font-bold font-syne text-graphite-black mb-4">{t('faq.stillHaveQuestions')}</h3>
          <p className="text-graphite-black/70 mb-6 max-w-lg mx-auto">
            {t('faq.contactPrompt')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="mailto:info@vespanida.com" 
              className="flex items-center px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>info@vespanida.com</span>
            </a>
            <a 
              href="tel:+37067956380" 
              className="flex items-center px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+3706 795 6380</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}