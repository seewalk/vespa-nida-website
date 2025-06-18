// src/components/Header.js
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, languages } from './context/LanguageContext'; // Import language context

export default function Header() {
  // State management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  // Use the language context (get t function as well)
  const { currentLanguage, changeLanguage, t } = useLanguage();
  
  // Get the current language display name
  const getCurrentLanguageDisplay = () => {
    return currentLanguage.toUpperCase();
  };

  // Update the language selector buttons
  const handleLanguageChange = (code) => {
    changeLanguage(code);
    setLanguageMenuOpen(false);
  };
  
  // Header reference for calculations
  const headerRef = useRef(null);
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);
      
      // Determine active section based on scroll position
      const sections = ['home', 'about', 'fleet', 'explore', 'shop', 'contact'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && headerRef.current && !headerRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);
  
  // Navigation items with icons - Now t function is defined
  const navItems = [
    { 
      name: t('nav.about'), 
      href: '#about', 
      icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
    },
    { 
      name: t('nav.fleet'), 
      href: '#fleet', 
      icon: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0' 
    },
    { 
      name: t('nav.explore'), 
      href: '#explore', 
      icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
    },
    { 
      name: t('nav.shop'), 
      href: '#shop', 
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' 
    },
    { 
      name: t('nav.contact'), 
      href: '#contact', 
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' 
    }
  ];
  
  return (
    <header 
      ref={headerRef}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-2 bg-ivory-white shadow-md' 
          : 'py-4 bg-ivory-white/95'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="relative z-10 flex items-center group">
            <div className="relative overflow-hidden">
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image 
                  src="/images/logo.jpg" 
                  alt="Vespa Nida Logo" 
                  width={200} 
                  height={67} 
                  className={`w-auto transition-all duration-300 ${
                    scrolled ? 'h-10' : 'h-12'
                  }`}
                  priority 
                />
              </motion.div>
            </div>
            <span className="ml-3 text-xs text-sage-green font-medium hidden md:block opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              EST. 2025
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Navigation Links */}
            <nav className="flex mr-6">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`relative px-4 py-2 font-medium transition-colors ${
                    activeSection === item.href.substring(1) 
                      ? 'text-sage-green' 
                      : 'text-graphite-black hover:text-sage-green'
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  
                  {activeSection === item.href.substring(1) && (
                    <motion.span 
                      layoutId="activeSection"
                      className="absolute inset-0 bg-sage-green/5 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
            
            {/* Desktop Language Selector - Now includes Polish */}
            <div className="relative mr-4">
              <button 
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center text-sm text-graphite-black/70 hover:text-sage-green p-2 transition-colors"
                aria-label="Select language"
              >
                <span className="mr-1">{getCurrentLanguageDisplay()}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <AnimatePresence>
                {languageMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    {languages.map((lang) => (
                      <button 
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-sage-green/10 transition-colors ${
                          lang.code === currentLanguage ? 'text-sage-green font-medium' : 'text-graphite-black'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Booking Button */}
            <Link 
              href="#contact" 
              className={`btn-primary flex items-center transition-all duration-300 ${
                scrolled ? 'px-4 py-2 text-sm' : 'px-5 py-2.5'
              }`}
            >
              <span>{t('buttons.bookNow')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          {/* Mobile Contact Info */}
          <div className="hidden md:flex lg:hidden items-center">
            <a 
              href="tel:+37067956380" 
              className="flex items-center text-sm text-graphite-black mr-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+3706 795 6380</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden z-10 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative w-6 h-5">
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 8 : 0 }}
                className="absolute top-0 left-0 w-6 h-0.5 bg-graphite-black rounded-full"
              />
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="absolute top-2 left-0 w-6 h-0.5 bg-graphite-black rounded-full"
              />
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -8 : 0 }}
                className="absolute top-4 left-0 w-6 h-0.5 bg-graphite-black rounded-full"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 64px)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-[64px] left-0 right-0 bg-ivory-white overflow-hidden z-40 lg:hidden"
          >
            <div className="container mx-auto px-6 py-12">
              <div className="flex flex-col h-full">
                {/* Navigation Links */}
                <nav className="flex flex-col space-y-6 mb-10">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                    >
                      <Link 
                        href={item.href}
                        className="flex items-center group"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="w-10 h-10 rounded-full bg-sage-green/10 flex items-center justify-center mr-4 group-hover:bg-sage-green/20 transition-colors">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 text-sage-green" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                          </svg>
                        </div>
                        <span className="text-xl font-syne font-medium text-graphite-black group-hover:text-sage-green transition-colors">
                          {item.name}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                
                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="mt-auto"
                >
                  <div className="border-t border-graphite-black/10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <a 
                      href="tel:+37067956380" 
                      className="flex items-center text-graphite-black/70 hover:text-sage-green transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+3706 795 6380</span>
                    </a>
                    <a 
                      href="mailto:info@vespanida.com" 
                      className="flex items-center text-graphite-black/70 hover:text-sage-green transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>info@vespanida.com</span>
                    </a>
                  </div>
                  
                  {/* Mobile Languages in menu - Now includes Polish */}
                  <div className="mt-6">
                    <p className="text-xs text-graphite-black/50 mb-2">{t('footer.chooseLanguage')}</p>
                    <div className="flex space-x-2">
                      {languages.map(lang => (
                        <button 
                          key={lang.code} 
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`
                            px-3 py-1.5 text-xs rounded-md transition-all duration-300
                            ${lang.code === currentLanguage 
                              ? 'bg-sage-green text-white font-medium shadow-sm' 
                              : 'bg-graphite-black/5 text-graphite-black hover:bg-graphite-black/10'}
                            focus:outline-none focus:ring-2 focus:ring-sage-green/40
                            transform hover:scale-105 active:scale-95
                          `}
                          aria-label={`Switch to ${lang.name} language`}
                        >
                          {lang.code.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Book Now Button */}
                  <Link 
                    href="#contact"
                    className="btn-primary w-full text-center mt-8 flex items-center justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{t('buttons.bookYourRide')}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}