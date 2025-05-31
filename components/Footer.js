'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

export default function Footer() {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.1 });
  
  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput && emailInput.includes('@')) {
      // Here you would typically send this to your newsletter API
      console.log('Subscribing email:', emailInput);
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
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
  
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Years in business calculation
  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const yearsInBusiness = currentYear - startYear;

  return (
    <footer className="bg-graphite-black text-white relative" ref={footerRef}>
      {/* Wave SVG divider */}
      <div className="absolute top-0 left-0 right-0 transform -translate-y-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-graphite-black">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
      
      {/* Newsletter signup bar */}
      <div className="bg-sage-green py-10 px-4 relative z-10">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-syne font-bold text-white">Join Our Newsletter</h3>
              <p className="text-white/80 text-sm mt-1">Get exclusive offers and updates about Nida's scenic routes</p>
            </div>
            
            <form 
              className="flex flex-col sm:flex-row gap-3 w-full md:w-auto" 
              onSubmit={handleSubscribe}
            >
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 pr-10 rounded-lg text-graphite-black w-full sm:w-80"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
                {subscribed && (
                  <div className="absolute inset-0 bg-sage-green/90 rounded-lg flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Thank you for subscribing!</span>
                  </div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="px-6 py-3 bg-graphite-black text-white rounded-lg font-medium hover:bg-graphite-black/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Main footer content */}
      <div className="pt-20 pb-12 px-6">
        <div className="container mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Brand Column */}
            <motion.div variants={childVariants}>
              <Link href="/" className="block mb-6">
                <Image 
                  src="/images/logo.jpg" 
                  alt="Vespa Nida Logo" 
                  width={150} 
                  height={50}
                  className="h-10 w-auto"
                />
              </Link>
              
              <p className="text-chrome-silver mb-8 max-w-xs">
                Luxury Vespa scooter rentals in Nida, Lithuania. Experience the natural beauty of the Curonian Spit in style and freedom.
              </p>
              
              <div className="flex space-x-4 mb-8">
                <a 
                  href="#" 
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-sage-green transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-sage-green transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-sage-green transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-sage-green transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </a>
              </div>
              
              <div className="inline-flex items-center px-4 py-2 bg-sage-green/10 rounded-lg text-sage-green text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{yearsInBusiness > 0 ? `${yearsInBusiness} Years in Business` : 'Established 2023'}</span>
              </div>
            </motion.div>
            
            {/* Quick Links Column */}
            <motion.div variants={childVariants}>
              <h3 className="text-lg font-syne font-bold mb-6 flex items-center">
                <span className="w-6 h-px bg-sage-green mr-3"></span>
                Quick Links
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="/" 
                    className="hover:text-sage-green transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-sage-green mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    <span>Home</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#about" 
                    className="hover:text-sage-green transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-sage-green mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    <span>About Us</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#fleet" 
                    className="hover:text-sage-green transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-sage-green mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    <span>Our Fleet</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#explore" 
                    className="hover:text-sage-green transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-sage-green mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    <span>Explore Nida</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#shop" 
                    className="hover:text-sage-green transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-sage-green mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    <span>Shop</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#contact" 
                    className="hover:text-sage-green transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-sage-green mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    <span>Book Now</span>
                  </Link>
                </li>
              </ul>
              
              {/* Languages */}
              <div className="mt-8">
                <h4 className="text-sm font-medium text-white/60 mb-3">Languages</h4>
                <div className="flex space-x-2">
                  <button className="px-2 py-1 bg-sage-green text-white text-xs rounded">EN</button>
                  <button className="px-2 py-1 bg-white/10 text-white text-xs rounded hover:bg-white/20">LT</button>
                  <button className="px-2 py-1 bg-white/10 text-white text-xs rounded hover:bg-white/20">DE</button>
                </div>
              </div>
            </motion.div>
            
            {/* Information Column */}
            <motion.div variants={childVariants}>
              <h3 className="text-lg font-syne font-bold mb-6 flex items-center">
                <span className="w-6 h-px bg-sage-green mr-3"></span>
                Information
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href="#" 
                    className="hover:text-sage-green transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-sage-green mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    <span>FAQ</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#" 
                    className="hover:text-sage-green transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-sage-green mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    <span>Terms & Conditions</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#" 
                    className="hover:text-sage-green transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-sage-green mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    <span>Privacy Policy</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#" 
                    className="hover:text-sage-green transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-sage-green mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    <span>Rental Agreement</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#" 
                    className="hover:text-sage-green transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-sage-green mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    <span>Careers</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#" 
                    className="hover:text-sage-green transition-colors inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-sage-green mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    <span>Blog</span>
                  </Link>
                </li>
              </ul>
              
              {/* Badges */}
              <div className="mt-8 flex flex-wrap gap-2">
                <div className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Secure Payments</span>
                </div>
                <div className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/70 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Insured Rentals</span>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Column */}
            <motion.div variants={childVariants}>
              <h3 className="text-lg font-syne font-bold mb-6 flex items-center">
                <span className="w-6 h-px bg-sage-green mr-3"></span>
                Contact Us
              </h3>
              <ul className="space-y-5">
                <li className="flex">
                  <div className="mr-3 mt-1">
                    <div className="w-8 h-8 rounded-full bg-sage-green/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-sage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Address</h4>
                    <p className="text-white/60 text-sm">Pamario g. 12, Nida, Lithuania 00321</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-3 mt-1">
                    <div className="w-8 h-8 rounded-full bg-sage-green/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-sage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Phone</h4>
                    <a href="tel:+37061234567" className="text-white/60 text-sm hover:text-sage-green transition-colors">+370 612 34567</a>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-3 mt-1">
                    <div className="w-8 h-8 rounded-full bg-sage-green/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-sage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Email</h4>
                    <a href="mailto:info@vespanida.com" className="text-white/60 text-sm hover:text-sage-green transition-colors">info@vespanida.com</a>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-3 mt-1">
                    <div className="w-8 h-8 rounded-full bg-sage-green/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-sage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Hours</h4>
                    <p className="text-white/60 text-sm">Mon-Fri: 9am - 6pm</p>
                    <p className="text-white/60 text-sm">Sat-Sun: 10am - 4pm</p>
                  </div>
                </li>
              </ul>
              
              {/* Google Maps Link */}
              <a 
                href="https://maps.google.com/?q=Pamario+g.+12,+Nida,+Lithuania" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center mt-6 text-sage-green hover:underline"
              >
                <span>View on Google Maps</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
          
          {/* Bottom area with copyright and payment methods */}
          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left text-sm text-chrome-silver mb-4 md:mb-0">
              <p>© {new Date().getFullYear()} Vespa Nida. All rights reserved.</p>
              <p className="mt-1 italic text-white/40">"Crafted with elegance for authentic rides."</p>
            </div>
            
            <div className="flex flex-col items-center md:items-end space-y-4">
              {/* Payment methods */}
              <div className="flex space-x-3">
                  <div className="h-8 w-12 bg-white/10 rounded px-1 flex items-center justify-center">
                    <svg className="h-4" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07"/>
                      <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFF"/>
                      <path d="M28.3 10.1H28c-.4 1-.7 1.5-1 3h1.9c-.3-1.5-.3-2.2-.6-3zm2.9 5.9h-1.7c-.1 0-.1 0-.2-.1l-.2-.9-.1-.2h-2.4c-.1 0-.2 0-.2.2l-.3.9c0 .1-.1.1-.1.1h-2.1l.2-.5L27 8.7c0-.5.3-.7.8-.7h1.5c.1 0 .2 0 .2.2l1.4 6.5c.1.4.2.7.2 1.1.1.1.1.1.1.2zm-13.4-.3l.4-1.8c.1 0 .2.1.2.1.7.3 1.4.5 2.1.4.2 0 .5-.1.7-.2.5-.2.5-.7.1-1.1-.2-.2-.5-.3-.8-.5-.4-.2-.8-.4-1.1-.7-1.2-1-.8-2.4-.1-3.1.6-.4.9-.8 1.7-.8 1.2 0 2.5 0 3.1.2h.1c-.1.6-.2 1.1-.4 1.7-.5-.2-1-.4-1.5-.4-.3 0-.6 0-.9.1-.2 0-.3.1-.4.2-.2.2-.2.5 0 .7l.5.4c.4.2.8.4 1.1.6.5.3 1 .8 1.1 1.4.2.9-.1 1.7-.9 2.3-.5.4-.7.6-1.4.6-1.4 0-2.5.1-3.4-.2-.1.2-.1.2-.2.1zm-3.5.3c.1-.7.1-.7.2-1 .5-2.2 1-4.5 1.4-6.7.1-.2.1-.3.3-.3H18c-.2 1.2-.4 2.1-.7 3.2-.3 1.5-.6 3-1 4.5 0 .2-.1.2-.3.2M5 8.2c0-.1.2-.2.3-.2h3.4c.5 0 .9.3 1 .8l.9 4.4c0 .1 0 .1.1.2 0-.1.1-.1.1-.1l2.1-5.1c-.1-.1 0-.2.1-.2h2.1c0 .1 0 .1-.1.2l-3.1 7.3c-.1.2-.1.3-.2.4-.1.1-.3 0-.5 0H9.7c-.1 0-.2 0-.2-.2L7.9 9.5c-.2-.2-.5-.5-.9-.6-.6-.3-1.7-.5-1.9-.5L5 8.2z" fill="#142688"/>
                    </svg>
                  </div>
                  <div className="h-8 w-12 bg-white/10 rounded px-1 flex items-center justify-center">
                    <svg className="h-4" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#000" opacity=".07"/>
                      <path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFF"/>
                      <path d="M15 19h2v-2h-2v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm4-4h2v-2h-2v2zm0-4h2V9h-2v2zm0-4h2V5h-2v2zm-12 8h2v-2h-2v2zm-4 0h2v-2H7v2zm-4 0h2v-2H3v2zm5-4h2v-2H8v2zm-4 0h2v-2H4v2zm-1-4h2V9H3v2zm5 0h2V9H8v2zm4 0h2V9h-2v2zm8 8h2v-2h-2v2zm-4 0h2v-2h-2v2zm0-8h2V9h-2v2zm-4 4h2v-2h-2v2zm-8 0h2v-2H4v2zm5 0h2v-2H9v2zm4 0h2v-2h-2v2z" fill="#EB001B"/>
                      <path d="M23 16h-3v2h3v-2zm4 0h-3v2h3v-2z" fill="#F79E1B"/>
                    </svg>
                  </div>
                  <div className="h-8 w-12 bg-white/10 rounded px-1 flex items-center justify-center">
                    <svg className="h-4" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
                      <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
                      <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
                      <path fill="#003087" d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"/>
                      <path fill="#3086C8" d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"/>
                      <path fill="#012169" d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Back to top button */}
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group flex items-center text-sm text-chrome-silver hover:text-sage-green transition-colors"
                  aria-label="Back to top"
                >
                  <span>Back to top</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
    </footer>
  );
}