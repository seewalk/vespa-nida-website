'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { collection, addDoc } from 'firebase/firestore';
import Image from 'next/image';

// Note: Ensure db is properly imported from your firebase config
// import { db } from '../lib/firebase';

export default function BookingForm() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
    model: 'Vespa Primavera',
    route: '',
    riders: '1',
    message: ''
  });
  
  // Calculate min date for the datepicker (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  
  // Calculate rental duration and price
  const [rentalDays, setRentalDays] = useState(0);
  const [rentalPrice, setRentalPrice] = useState(0);
  
  const modelPrices = {
    'Vespa Primavera': 79,
    'Vespa GTS': 99,
    'Vespa Sprint': 69
  };
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [modelHovered, setModelHovered] = useState(null);
  
  // Animation refs
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  // Vespa models data with extended info
  const vespaModels = [
    {
      id: 'primavera',
      name: 'Vespa Primavera',
      color: 'Ivory White',
      cc: '150cc',
      topSpeed: '95 km/h',
      range: '180 km',
      idealFor: 'Coastal cruising',
      image: '/images/fleet-white-vespa.jpg',
      price: 79
    },
    {
      id: 'gts',
      name: 'Vespa GTS',
      color: 'Sage Green',
      cc: '300cc',
      topSpeed: '120 km/h',
      range: '220 km',
      idealFor: 'Longer journeys',
      image: '/images/fleet-green-vespa.jpg',
      price: 99
    },
    {
      id: 'sprint',
      name: 'Vespa Sprint',
      color: 'Sand Beige',
      cc: '125cc',
      topSpeed: '90 km/h',
      range: '160 km',
      idealFor: 'Exploring narrow streets',
      image: '/images/fleet-beige-vespa.jpg',
      price: 69
    }
  ];
  
  // Route options
  const routeOptions = [
    { id: 'none', name: 'No specific route (self-guided)' },
    { id: 'coastal', name: 'Coastal Lighthouse Route (12 km)' },
    { id: 'dunes', name: 'Sand Dunes Adventure (18 km)' },
    { id: 'village', name: 'Fisherman\'s Village Tour (8 km)' },
    { id: 'custom', name: 'Custom route (describe in message)' }
  ];

  // Update rental days and price when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setRentalDays(diffDays);
      
      const basePrice = modelPrices[formData.model] || 79;
      const ridersCount = parseInt(formData.riders) || 1;
      const extraRiderFee = ridersCount > 1 ? 15 : 0;
      
      setRentalPrice((basePrice + extraRiderFee) * diffDays);
    } else {
      setRentalDays(0);
      setRentalPrice(0);
    }
  }, [formData.startDate, formData.endDate, formData.model, formData.riders]);

  // Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Handle date relationships
    if (name === 'startDate' && formData.endDate && new Date(value) > new Date(formData.endDate)) {
      setFormData(prev => ({ ...prev, endDate: value }));
    }
  };
  
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Uncomment this when you have Firebase properly configured
      // await addDoc(collection(db, "bookings"), {
      //   ...formData,
      //   rentalDays,
      //   rentalPrice,
      //   createdAt: new Date()
      // });
      
      // For demo purposes, simulating a successful submission with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        startDate: '',
        endDate: '',
        model: 'Vespa Primavera',
        route: '',
        riders: '1',
        message: ''
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      setError('There was an error submitting your booking. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };
  
  // Navigation between form steps
  const nextStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => Math.min(prev + 1, 3));
    
    // Scroll to top of form
    document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
  };
  
  const prevStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
    
    // Scroll to top of form
    document.getElementById('booking-form').scrollIntoView({ behavior: 'smooth' });
  };
  
  // Variants for animations
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-ivory-white relative" ref={sectionRef}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-sage-green/5 rounded-full"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-sage-green/5 rounded-full"></div>
      </div>
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block font-syne uppercase tracking-wider text-sage-green mb-2 text-sm">Reservation</span>
          <h2 className="text-3xl md:text-5xl font-bold font-syne text-graphite-black">Book Your Vespa Adventure</h2>
          <div className="w-24 h-1 bg-sage-green mx-auto mt-6 mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-graphite-black/70">
            Ready to explore Nida in style? Complete the booking form below to reserve your Vespa for an unforgettable journey.
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto" id="booking-form">
          {/* Form progress steps */}
          <motion.div 
            className="mb-8 hidden md:block"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex justify-center items-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      currentStep === step 
                        ? 'bg-sage-green text-white' 
                        : currentStep > step 
                        ? 'bg-sage-green/20 text-sage-green' 
                        : 'bg-graphite-black/10 text-graphite-black/40'
                    } transition-colors duration-300`}
                  >
                    {currentStep > step ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step
                    )}
                  </div>
                  
                  <div className={`text-sm mx-3 font-medium ${currentStep === step ? 'text-graphite-black' : 'text-graphite-black/50'}`}>
                    {step === 1 ? 'Choose Your Vespa' : step === 2 ? 'Rental Details' : 'Personal Information'}
                  </div>
                  
                  {step < 3 && (
                    <div className={`flex-1 h-0.5 w-12 ${
                      currentStep > step ? 'bg-sage-green' : 'bg-graphite-black/10'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Success message */}
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-10 md:p-16 rounded-2xl shadow-lg text-center"
              >
                <div className="w-20 h-20 rounded-full bg-sage-green/20 flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-3xl font-bold font-syne mb-4">Booking Request Received!</h3>
                <p className="text-lg text-graphite-black/70 mb-8 max-w-md mx-auto">
                  Thank you for your reservation request. We will contact you shortly to confirm your booking details and provide payment instructions.
                </p>
                
                <div className="p-6 bg-sage-green/5 rounded-lg mb-8">
                  <p className="text-sm text-graphite-black/70">
                    A confirmation email has been sent to your email address. If you don't receive it within a few minutes, please check your spam folder.
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setSuccess(false)} 
                    className="btn-primary"
                  >
                    Make Another Booking
                  </button>
                  
                  <a href="#explore" className="px-6 py-3 border border-sage-green text-sage-green rounded font-medium hover:bg-sage-green/5 transition-colors">
                    Explore Scenic Routes
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="bg-white p-8 md:p-12 rounded-2xl shadow-lg"
              >
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </motion.div>
                )}
                
                {/* Form Steps */}
                <AnimatePresence mode="wait">
                  {/* Step 1: Choose Vespa */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      variants={formVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h3 className="text-xl font-bold mb-6 font-syne">Choose Your Vespa</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {vespaModels.map((model) => (
                          <div 
                            key={model.id}
                            className={`border rounded-xl p-2 cursor-pointer transition-all duration-300 ${
                              formData.model === model.name 
                                ? 'border-sage-green ring-1 ring-sage-green bg-sage-green/5' 
                                : 'border-sand-beige hover:border-sage-green'
                            }`}
                            onClick={() => setFormData(prev => ({ ...prev, model: model.name }))}
                            onMouseEnter={() => setModelHovered(model.id)}
                            onMouseLeave={() => setModelHovered(null)}
                          >
                            <div className="relative h-40 mb-3 rounded-lg overflow-hidden">
                              <Image
                                src={model.image}
                                alt={model.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                              <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-0.5 rounded text-xs font-bold">
                                €{model.price}/day
                              </div>
                            </div>
                            
                            <div className="px-2">
                              <div className="flex justify-between items-start">
                                <h4 className="font-syne font-bold">{model.name}</h4>
                                <div 
                                  className="w-3 h-3 rounded-full mt-1" 
                                  style={{ backgroundColor: model.color === 'Ivory White' ? '#F9F7F1' : model.color === 'Sage Green' ? '#9AA89C' : '#E9DCC9' }}
                                ></div>
                              </div>
                              <p className="text-xs text-sage-green mb-2">{model.color}</p>
                              
                              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-graphite-black/70">
                                <div className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  <span>{model.cc}</span>
                                </div>
                                <div className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                  </svg>
                                  <span>{model.range}</span>
                                </div>
                                <div className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  </svg>
                                  <span>{model.topSpeed}</span>
                                </div>
                                <div className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                  </svg>
                                  <span>{model.idealFor}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between mt-8">
                        <div></div> {/* Empty div for spacing */}
                        <button 
                          type="button" 
                          onClick={nextStep}
                          className="btn-primary flex items-center"
                        >
                          <span>Continue to Dates</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 2: Rental Details */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      variants={formVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h3 className="text-xl font-bold mb-6 font-syne">Rental Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="startDate" className="block mb-2 font-medium">Start Date</label>
                          <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            min={minDate}
                            className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                          />
                          <p className="mt-1 text-xs text-graphite-black/50">Rentals start at 9:00 AM</p>
                        </div>
                        
                        <div>
                          <label htmlFor="endDate" className="block mb-2 font-medium">End Date</label>
                          <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            required
                            min={formData.startDate || minDate}
                            className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                          />
                          <p className="mt-1 text-xs text-graphite-black/50">Rentals end at 6:00 PM</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="riders" className="block mb-2 font-medium">Number of Riders</label>
                          <select
                            id="riders"
                            name="riders"
                            value={formData.riders}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                          >
                            <option value="1">1 Person</option>
                            <option value="2">2 People</option>
                          </select>
                          <p className="mt-1 text-xs text-graphite-black/50">Additional rider: €15/day</p>
                        </div>
                        
                        <div>
                          <label htmlFor="route" className="block mb-2 font-medium">Preferred Route</label>
                          <select
                            id="route"
                            name="route"
                            value={formData.route}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                          >
                            <option value="" disabled>Select a route</option>
                            {routeOptions.map(route => (
                              <option key={route.id} value={route.id}>{route.name}</option>
                            ))}
                          </select>
                          <p className="mt-1 text-xs text-graphite-black/50">GPS route guides available for all options</p>
                        </div>
                      </div>
                      
                      {/* Price calculation */}
                      {rentalDays > 0 && (
                        <motion.div 
                          className="mt-8 p-5 bg-sage-green/5 rounded-lg"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <h4 className="font-syne font-bold mb-3">Rental Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Vespa {formData.model.split(' ')[1]} ({modelPrices[formData.model]}€/day × {rentalDays} days)</span>
                              <span>{modelPrices[formData.model] * rentalDays}€</span>
                            </div>
                            
                            {parseInt(formData.riders) > 1 && (
                              <div className="flex justify-between">
                                <span>Additional rider fee (15€/day × {rentalDays} days)</span>
                                <span>{15 * rentalDays}€</span>
                              </div>
                            )}
                            
                            <div className="flex justify-between font-bold pt-2 border-t border-sage-green/20">
                              <span>Total</span>
                              <span>{rentalPrice}€</span>
                            </div>
                          </div>
                          <p className="mt-3 text-xs text-graphite-black/60">
                            A 25% deposit will be required to confirm your booking. The remaining balance is due upon pickup.
                          </p>
                        </motion.div>
                      )}
                      
                      <div className="flex justify-between mt-8">
                        <button 
                          type="button" 
                          onClick={prevStep}
                          className="px-4 py-2 flex items-center text-sage-green hover:text-sage-green/80"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          <span>Back</span>
                        </button>
                        
                        <button 
                          type="button" 
                          onClick={nextStep}
                          className={`btn-primary flex items-center ${
                            !formData.startDate || !formData.endDate ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={!formData.startDate || !formData.endDate}
                        >
                          <span>Continue to Personal Details</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Step 3: Personal Information */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      variants={formVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h3 className="text-xl font-bold mb-6 font-syne">Personal Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="name" className="block mb-2 font-medium">Full Name</label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                            placeholder="Enter your full name"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block mb-2 font-medium">Email Address</label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                            placeholder="Enter your email address"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block mb-2 font-medium">Phone Number</label>
                          <input
                             type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                            placeholder="Enter your phone number"
                          />
                          <p className="mt-1 text-xs text-graphite-black/50">We may contact you regarding your booking</p>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label htmlFor="message" className="block mb-2 font-medium">Special Requests</label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                            placeholder="Any special requirements or questions?"
                          ></textarea>
                        </div>
                      </div>
                      
                      {/* Booking summary */}
                      <div className="mt-8 p-6 bg-sage-green/5 rounded-xl">
                        <h4 className="font-syne font-bold mb-4">Booking Summary</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                          <div>
                            <span className="text-graphite-black/60">Vespa Model:</span>
                            <span className="ml-2 font-medium">{formData.model}</span>
                          </div>
                          <div>
                            <span className="text-graphite-black/60">Duration:</span>
                            <span className="ml-2 font-medium">{rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span>
                          </div>
                          <div>
                            <span className="text-graphite-black/60">Pick-up:</span>
                            <span className="ml-2 font-medium">{formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Not selected'}</span>
                          </div>
                          <div>
                            <span className="text-graphite-black/60">Drop-off:</span>
                            <span className="ml-2 font-medium">{formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'Not selected'}</span>
                          </div>
                          <div>
                            <span className="text-graphite-black/60">Riders:</span>
                            <span className="ml-2 font-medium">{formData.riders} {parseInt(formData.riders) === 1 ? 'person' : 'people'}</span>
                          </div>
                          <div>
                            <span className="text-graphite-black/60">Route:</span>
                            <span className="ml-2 font-medium">
                              {formData.route ? routeOptions.find(r => r.id === formData.route)?.name.split(' (')[0] : 'Not selected'}
                            </span>
                          </div>
                          <div className="md:col-span-2 pt-3 mt-2 border-t border-sage-green/20">
                            <span className="text-graphite-black/60">Total Price:</span>
                            <span className="ml-2 font-bold">€{rentalPrice}</span>
                            <span className="ml-1 text-xs text-graphite-black/50">(25% deposit: €{Math.round(rentalPrice * 0.25)})</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-start">
                        <input 
                          type="checkbox" 
                          id="terms" 
                          className="mt-1 border-sand-beige text-sage-green focus:ring-sage-green rounded" 
                          required 
                        />
                        <label htmlFor="terms" className="ml-3 text-sm text-graphite-black/70">
                          I agree to the <a href="#" className="text-sage-green hover:underline">Terms of Service</a> and acknowledge the <a href="#" className="text-sage-green hover:underline">Privacy Policy</a>. I confirm that I am at least 18 years old and possess a valid driver's license.
                        </label>
                      </div>
                      
                      <div className="flex justify-between mt-8">
                        <button 
                          type="button" 
                          onClick={prevStep}
                          className="px-4 py-2 flex items-center text-sage-green hover:text-sage-green/80"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          <span>Back</span>
                        </button>
                        
                        <button 
                          type="submit" 
                          className="btn-primary flex items-center"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <span>Complete Booking</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>
            )}
          </AnimatePresence>
          
          {/* Additional information */}
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-full bg-sage-green/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-syne font-bold mb-2">Rental Hours</h4>
              <p className="text-sm text-graphite-black/70">
                Our rental hours are from 9:00 AM to 6:00 PM daily. Extended hours available upon request.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-full bg-sage-green/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-syne font-bold mb-2">Payment Policy</h4>
              <p className="text-sm text-graphite-black/70">
                A 25% deposit is required to confirm your booking. The remaining balance is due upon pickup.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-full bg-sage-green/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="font-syne font-bold mb-2">Cancellation Policy</h4>
              <p className="text-sm text-graphite-black/70">
                Free cancellation up to 48 hours before your rental. After that, the deposit becomes non-refundable.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-sm text-graphite-black/60">
              Need assistance with your booking? Contact us directly at <a href="tel:+37061234567" className="text-sage-green hover:underline">+370 612 34567</a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}