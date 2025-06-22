'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useLanguage } from './context/LanguageContext';
import SEO from './SEO';

export default function FAQSection() {
  const { t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('faq'); // 'faq' or 'rights'
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

  // Rights data with detailed Q&A format
  const rightsData = [
    {
      id: "cancellation",
      category: "cancellation",
      question: t('rights.questions.q1'),
      answer: t('rights.answers.a1'),
      badge: t('rights.badges.b1'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: "refund",
      category: "refund",
      question: t('rights.questions.q2'),
      answer: t('rights.answers.a2'),
      badge: t('rights.badges.b2'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      id: "weather",
      category: "weather",
      question: t('rights.questions.q3'),
      answer: t('rights.answers.a3'),
      badge: t('rights.badges.b3'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      )
    },
    {
      id: "privacy",
      category: "privacy",
      question: t('rights.questions.q4'),
      answer: t('rights.answers.a4'),
      badge: t('rights.badges.b4'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      id: "complaint",
      category: "complaint",
      question: t('rights.questions.q5'),
      answer: t('rights.answers.a5'),
      badge: t('rightsbadges.b5'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      )
    },
    {
      id: "insurance",
      category: "insurance",
      question: t('rights.questions.q6'),
      answer: t('rights.answers.a6'),
      badge: t('rights.badges.b6'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

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
  
  // Filter categories for FAQ
  const [activeCategory, setActiveCategory] = useState("all");
  
  const faqCategories = [
    { id: "all", name: t('faq.categories.all') },
    { id: "booking", name: t('faq.categories.booking') },
    { id: "requirements", name: t('faq.categories.requirements') },
    { id: "rental", name: t('faq.categories.rental') },
    { id: "safety", name: t('faq.categories.safety') }
  ];

  const rightsCategories = [
    { id: "all", name: t('rights.categories.all') },
    { id: "cancellation", name: t('rights.categories.cancellation') },
    { id: "refund", name: t('rights.categories.refund') },
    { id: "weather", name: t('rights.categories.weather') },
    { id: "privacy", name: t('rights.categories.privacy') },
    { id: "complaint", name: t('rights.categories.complaint') },
    { id: "insurance", name: t('rights.categories.insurance') }
  ];
  
  // Filter items based on active category and section
  const currentItems = activeSection === 'faq' ? faqItems : rightsData;
  const currentCategories = activeSection === 'faq' ? faqCategories : rightsCategories;
  
  const filteredItems = activeCategory === "all" 
    ? currentItems 
    : currentItems.filter(item => item.category === activeCategory);
  
  // Toggle FAQ/Rights item
  const toggleItem = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
    setActiveCategory("all");
    setExpandedIndex(null);
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
    <>
      <SEO 
        title={activeSection === 'faq' ? t('faq.title') : t('rights.title')}
        description={activeSection === 'faq' ? t('faq.description') : t('rights.description')}
        keywords={activeSection === 'faq' ? "vespa rental FAQ, how to book vespa nida, vespa rental requirements" : "EU rights, consumer protection, vespa rental rights, GDPR"}
        ogImage={activeSection === 'faq' ? "/images/faq-vespa-help.jpg" : "/images/eu-rights-vespa.jpg"}
        section={activeSection}
      />
      
      <section id="faq-rights" className="py-24 bg-ivory-white relative" ref={sectionRef}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-sage-green/5 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sage-green/5 rounded-full"></div>
          {activeSection === 'rights' && (
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
          )}
        </div>
        
        <div className="container relative z-10">
          {/* Section Toggle */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-xl p-2 shadow-sm border border-sage-green/10">
              <button
                onClick={() => handleSectionChange('faq')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeSection === 'faq'
                    ? 'bg-sage-green text-white shadow-sm'
                    : 'text-graphite-black hover:bg-sage-green/5'
                }`}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('faq.title')}
                </span>
              </button>
              <button
                onClick={() => handleSectionChange('rights')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeSection === 'rights'
                    ? 'bg-sage-green text-white shadow-sm'
                    : 'text-graphite-black hover:bg-sage-green/5'
                }`}
              >
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {t('rights.title')}
                  {activeSection === 'rights' && (
                    <div className="ml-2 flex items-center">
                      <div className="w-6 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className="w-0.5 h-0.5 bg-yellow-400 rounded-full" />
                        ))}
                      </div>
                      <span className="text-xs ml-1">EU</span>
                    </div>
                  )}
                </span>
              </button>
            </div>
          </motion.div>

          <motion.header 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block font-syne uppercase tracking-wider text-sage-green mb-2 text-sm">
              {activeSection === 'faq' ? t('faq.subtitle') : t('rights.subtitle')}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold font-syne text-graphite-black">
              {activeSection === 'faq' ? t('faq.title') : t('rights.title')}
            </h1>
            <div className="w-24 h-1 bg-sage-green mx-auto mt-6 mb-8"></div>
            <p className="max-w-2xl mx-auto text-lg text-graphite-black/70">
              {activeSection === 'faq' ? t('faq.description') : t('rights.description')}
            </p>
          </motion.header>
          
          {/* Category Filter */}
          <motion.nav 
            className="flex flex-wrap justify-center gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            aria-label={`${activeSection} Categories`}
          >
            {currentCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  activeCategory === category.id
                    ? 'bg-sage-green text-white shadow-sm'
                    : 'bg-sand-beige/30 text-graphite-black hover:bg-sand-beige/50'
                }`}
                aria-pressed={activeCategory === category.id}
              >
                {category.name}
              </button>
            ))}
          </motion.nav>
          
          {/* Items Display */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-6"}
          >
            {filteredItems.map((item, index) => (
              <motion.article 
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                itemScope
                itemType="https://schema.org/Question"
                itemProp="mainEntity"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className={`w-full p-6 text-left flex items-center justify-between transition-colors ${
                    expandedIndex === index ? 'bg-sage-green/5' : 'hover:bg-sage-green/5'
                  }`}
                  aria-expanded={expandedIndex === index}
                  aria-controls={`item-answer-${index}`}
                >
                  <div className="flex items-start space-x-4 flex-1">
                    {activeSection === 'rights' && (
                      <div className="w-10 h-10 rounded-lg bg-sage-green/10 flex items-center justify-center flex-shrink-0">
                        {item.icon}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-syne font-medium text-lg text-left" itemProp="name">
                        {item.question}
                      </h3>
                      {activeSection === 'rights' && item.badge && (
                        <span className="inline-block mt-2 px-3 py-1 bg-sage-green text-white text-xs font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ml-4 transition-colors ${
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
                      className="px-6 pb-6 pt-1"
                      id={`item-answer-${index}`}
                      itemScope
                      itemType="https://schema.org/Answer"
                      itemProp="acceptedAnswer"
                    >
                      <p className="text-graphite-black/70 leading-relaxed" itemProp="text">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            ))}
          </motion.div>
          
          {/* Contact CTA */}
          <motion.div 
            className="mt-16 bg-sand-beige/30 rounded-xl p-8 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl md:text-2xl font-bold font-syne text-graphite-black mb-4">
              {activeSection === 'faq' ? t('faq.stillHaveQuestions') : t('rights.needHelp')}
            </h2>
            <p className="text-graphite-black/70 mb-6 max-w-lg mx-auto">
              {activeSection === 'faq' ? t('faq.contactPrompt') : t('rights.contactPrompt')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:info@vespanida.lt" 
                className="flex items-center px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@vespanida.lt</span>
              </a>
              <a 
                href="tel:+37067956380" 
                className="flex items-center px-6 py-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+370 679 56380</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}