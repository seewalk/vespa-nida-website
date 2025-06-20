'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Image from 'next/image';
import { useLanguage } from './context/LanguageContext';
import ToggleButton from './ToggleButton';
import SEO from './SEO';
import BookingCalendar from './admin/BookingCalendar';
import { validateBookingData, sanitizeString, sanitizeEmail, sanitizePhone, checkRateLimit } from '../lib/validation';
import SignatureCanvas from 'react-signature-canvas';

export default function BookingForm() {
  const { t, currentLanguage } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // Check for mobile and handle resize
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
    model: t('booking.models.sprint.name'),
    route: '',
    rentalType: 'full',
    additionalHelmet: false,
    age: '',
    drivingLicense: '',
    message: '',
    documentsAccepted: {
    rental: false,
    handover: false,
    safety: false
  },
  digitalSignature: null,
  documentsReadAt: null
  });
  
  // Calculate min date for the datepicker (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];
  
  // Calculate rental duration and price
  const [rentalDays, setRentalDays] = useState(0);
  const [rentalPrice, setRentalPrice] = useState(0);
  const [showDateWarning, setShowDateWarning] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [modelHovered, setModelHovered] = useState(null);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyVespaId, setNotifyVespaId] = useState(null);

  const handleNotifyClick = (id) => {
    setNotifyVespaId(id);
    setShowNotifyModal(true);
  };
  
  // Animation refs
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  // Vespa models data
  const vespaModels = [
    {
      id: 'sprint-elettrica-1',
      name: t('booking.models.sprint.name'),
      color: t('booking.models.sprint.color'),
      power: t('booking.models.sprint.power'),
      maxSpeed: t('booking.models.sprint.maxSpeed'),
      range: t('booking.models.sprint.range'),
      idealFor: t('booking.models.sprint.idealFor'),
      image: '/images/fleet-vespa-1.png',
      price: 59,
      originalPrice: 69,
      comingSoon: false
    },
    {
      id: 'sprint-elettrica-2',
      name: t('booking.models.sprint2.name'),
      color: t('booking.models.sprint2.color'),
      power: t('booking.models.sprint2.power'),
      maxSpeed: t('booking.models.sprint2.maxSpeed'),
      range: t('booking.models.sprint2.range'),
      idealFor: t('booking.models.sprint2.idealFor'),
      image: '/images/fleet-vespa-1.png',
      price: 59,
      originalPrice: 69,
      comingSoon: false
    },
    {
      id: 'sprint-elettrica-3',
      name: t('booking.models.sprint3.name'),
      color: t('booking.models.sprint3.color'),
      power: t('booking.models.sprint3.power'),
      maxSpeed: t('booking.models.sprint3.maxSpeed'),
      range: t('booking.models.sprint3.range'),
      idealFor: t('booking.models.sprint3.idealFor'),
      image: '/images/fleet-vespa-1.png',
      price: 59,
      originalPrice: 69,
      comingSoon: true
    }
  ];
  
  // Route options
  const routeOptions = [
    { id: 'none', name: t('booking.routes.none') },
    { id: 'coastal', name: t('booking.routes.coastal') },
    { id: 'dunes', name: t('booking.routes.dunes') },
    { id: 'village', name: t('booking.routes.village') },
    { id: 'custom', name: t('booking.routes.custom') }
  ];

  // Age options (21-80)
  const ageOptions = Array.from({ length: 60 }, (_, i) => i + 21);

  // Driving license options
  const drivingLicenseOptions = [
    { value: 'AM', label: 'AM' },
    { value: 'A1', label: 'A1' },
    { value: 'A2', label: 'A2' },
    { value: 'A', label: 'A' },
    { value: 'B1', label: 'B1' },
    { value: 'B', label: 'B' },
    { value: 'BE', label: 'BE' },
    { value: 'C1', label: 'C1' },
    { value: 'C1E', label: 'C1E' },
    { value: 'C', label: 'C' },
    { value: 'CE', label: 'CE' },
    { value: 'D1', label: 'D1' },
    { value: 'D1E', label: 'D1E' },
    { value: 'D', label: 'D' },
    { value: 'DE', label: 'DE' },
    { value: 'T', label: 'T' }
  ];

  // Notification modal component
  const NotifyModal = () => {
    const [notifyData, setNotifyData] = useState({
      name: '',
      phone: '',
      email: ''
    });
    const [submitted, setSubmitted] = useState(false);
    
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(`Notify for Vespa Elettrica:`, notifyData);
      setTimeout(() => {
        setSubmitted(true);
        setTimeout(() => {
          setShowNotifyModal(false);
          setSubmitted(false);
          setNotifyData({ name: '', phone: '', email: '' });
        }, 2000);
      }, 1000);
    };
    
    return (
      <>
        <SEO 
          title={t('booking.title')}
          description={t('booking.description')}
          keywords="vespa rental nida, explore nida, travel nida, travel to nida, nida scooter rental, nida vespa rental, nida electric scooter, nida vespa tours"
          ogImage="/images/hero-vespa-nida.jpg"
          section="home"
        />
      
        <AnimatePresence>
          {showNotifyModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
              onClick={() => setShowNotifyModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold font-syne mb-4">
                  {t('booking.notify.title')}
                </h3>
                
                {submitted ? (
                  <div className="text-center py-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-sage-green mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p>{t('booking.notify.success')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-graphite-black/70 mb-4">
                      {t('booking.notify.description')}
                    </p>
                    
                    <div>
                      <label htmlFor="notify-name" className="block text-sm font-medium mb-1">
                        {t('booking.notify.nameLabel')} *
                      </label>
                      <input
                        type="text"
                        id="notify-name"
                        value={notifyData.name}
                        onChange={(e) => setNotifyData({...notifyData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-sage-green"
                        placeholder={t('booking.notify.namePlaceholder')}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="notify-phone" className="block text-sm font-medium mb-1">
                        {t('booking.notify.phoneLabel')} *
                      </label>
                      <input
                        type="tel"
                        id="notify-phone"
                        value={notifyData.phone}
                        onChange={(e) => setNotifyData({...notifyData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-sage-green"
                        placeholder={t('booking.notify.phonePlaceholder')}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="notify-email" className="block text-sm font-medium mb-1">
                        {t('booking.notify.emailLabel')} *
                      </label>
                      <input
                        type="email"
                        id="notify-email"
                        value={notifyData.email}
                        onChange={(e) => setNotifyData({...notifyData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-sage-green"
                        placeholder={t('booking.notify.emailPlaceholder')}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowNotifyModal(false)}
                        className="px-4 py-2 border border-graphite-black/20 text-graphite-black rounded-lg hover:bg-graphite-black/5"
                      >
                        {t('booking.notify.cancel')}
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-sage-green text-white rounded-lg hover:bg-sage-green/90"
                      >
                        {t('booking.notify.submit')}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  };

  // Calendar date selection handler
  const handleCalendarDateSelect = (date) => {
    setFormData(prev => ({
      ...prev,
      startDate: date,
      endDate: date
    }));
    setShowDateWarning(false);
  };

  // Update rental days and price when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 1) {
        setShowDateWarning(true);
        setRentalDays(0);
        setRentalPrice(0);
        return;
      } else {
        setShowDateWarning(false);
      }
      
      setRentalDays(diffDays);
      
      let basePrice = formData.rentalType === 'full' ? 59 : 49;
      const helmetCost = formData.additionalHelmet ? 10 : 0;
      setRentalPrice(basePrice + helmetCost);
    } else {
      setRentalDays(0);
      setRentalPrice(0);
      setShowDateWarning(false);
    }
  }, [formData.startDate, formData.endDate, formData.rentalType, formData.additionalHelmet]);

  // Form input change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    if (name === 'startDate') {
      setFormData(prev => ({ ...prev, endDate: value }));
    }
    if (name === 'endDate' && formData.startDate && new Date(value) !== new Date(formData.startDate)) {
      setShowDateWarning(true);
    }
  };
  
  // Enhanced form submission handler with security
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Sanitize all inputs
      const sanitizedData = {
        name: sanitizeString(formData.name),
        email: sanitizeEmail(formData.email),
        phone: sanitizePhone(formData.phone),
        startDate: formData.startDate,
        endDate: formData.endDate,
        model: sanitizeString(formData.model),
        route: sanitizeString(formData.route),
        rentalType: formData.rentalType,
        additionalHelmet: Boolean(formData.additionalHelmet),
        age: parseInt(formData.age),
        drivingLicense: sanitizeString(formData.drivingLicense),
        message: sanitizeString(formData.message)
      };

      // Validate data
      const validation = validateBookingData(sanitizedData);
      if (!validation.isValid) {
        setError('Formos tikrinimas nepavyko: ' + validation.errors.join(', '));
        return;
      }

      // Rate limiting
      const clientId = sanitizedData.email || 'anonymous';
      const rateLimitCheck = checkRateLimit(clientId);
      if (!rateLimitCheck.allowed) {
        setError('Per daug užsakymo bandymų. Pabandykite vėliau.');
        return;
      }

      // Generate secure booking reference
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const bookingReference = `VN${new Date().getFullYear()}-${timestamp.toString().slice(-6)}${randomString.toUpperCase()}`;
      
      // Prepare secure booking data
      const bookingData = {
        bookingReference,
        status: 'pending_confirmation',
        customer: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          age: sanitizedData.age,
          drivingLicense: sanitizedData.drivingLicense,
        },
        booking: {
          vespaModel: sanitizedData.model,
          startDate: sanitizedData.startDate,
          endDate: sanitizedData.endDate,
          rentalType: sanitizedData.rentalType,
          route: sanitizedData.route,
          additionalHelmet: sanitizedData.additionalHelmet,
          message: sanitizedData.message,
        },
        pricing: {
          basePrice: sanitizedData.rentalType === 'full' ? 59 : 49,
          helmetPrice: sanitizedData.additionalHelmet ? 10 : 0,
          subtotal: rentalPrice,
          securityDeposit: 500,
          totalAmount: rentalPrice + 500,
        },
        metadata: {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          language: currentLanguage || 'lt',
          source: 'website_booking_form',
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
          referrer: typeof window !== 'undefined' ? document.referrer : '',
          sessionId: typeof window !== 'undefined' ? (sessionStorage.getItem('sessionId') || 'unknown') : 'unknown',
        },
        workflow: {
          confirmationEmailSent: false,
          contractEmailSent: false,
          contractSigned: false,
          thankYouEmailSent: false,
          paymentProcessed: false,
          completedAt: null,
          documentsReviewed: true,
    documentsSigned: !!formData.digitalSignature,
    documentsAcceptedAt: serverTimestamp()
  },
        documents: {
    rental: formData.documentsAccepted.rental,
    handover: formData.documentsAccepted.handover,
    safety: formData.documentsAccepted.safety,
    acceptedAt: serverTimestamp(),
    signature: formData.digitalSignature
  },
      };

      // Save to Firebase Firestore
      console.log('🔥 Saving booking to Firebase...', bookingData);
      const docRef = await addDoc(collection(db, "bookings"), bookingData);
      console.log("✅ Booking saved with ID: ", docRef.id);

      setSuccess(true);
      
      // Reset form
      setFormData({
  name: '',
  email: '',
  phone: '',
  startDate: '',
  endDate: '',
  model: t('booking.models.sprint.name'),
  route: '',
  rentalType: 'full',
  additionalHelmet: false,
  age: '',
  drivingLicense: '',
  message: '',
  documentsAccepted: {
    rental: false,
    handover: false,
    safety: false
  },
  digitalSignature: null,
  documentsReadAt: null
});

    } catch (err) {
      console.error("❌ Error submitting booking:", err);
      
      // Don't expose internal errors to users
      if (err.code === 'permission-denied') {
        setError('Leidimas atmestas. Patikrinkite užsakymo duomenis.');
      } else if (err.code === 'invalid-argument') {
        setError('Neteisingi užsakymo duomenys. Patikrinkite informaciją.');
      } else {
        setError('Užsakymo pateikimas nepavyko. Pabandykite dar kartą.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Navigation between form steps
  const nextStep = (e) => {
  e.preventDefault();
  setCurrentStep(prev => Math.min(prev + 1, 4)); // Changed from 3 to 4
  document.getElementById('booking-form-steps')?.scrollIntoView({ behavior: 'smooth' });
};
  
  const prevStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => Math.max(prev - 1, 1));
    document.getElementById('booking-form-steps')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Animation variants
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

  const DocumentReview = ({ 
  documentsAccepted, 
  onDocumentAccept, 
  onContinue, 
  onBack,
  disabled = false 
}) => {
  const [expandedDoc, setExpandedDoc] = useState(null);
  
  const documents = [
    {
      id: 'rental',
      title: t('documents.rental.title', 'Nuomos sutartis'),
      required: true
    },
    {
      id: 'handover',
      title: t('documents.handover.title', 'Perdavimo sutartis'),
      required: true
    },
    {
      id: 'safety',
      title: t('documents.safety.title', 'Saugumo ir atsakomybių taisyklės'),
      required: true
    }
  ];

  const allDocumentsAccepted = documents.every(doc => 
    documentsAccepted[doc.id] === true
  );

  const handleDocumentToggle = (docId) => {
    onDocumentAccept(docId, !documentsAccepted[docId]);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-2 font-syne">
          {t('documents.title', 'Dokumentų peržiūra')}
        </h3>
        <p className="text-sm text-graphite-black/70">
          {t('documents.description', 'Prašome perskaityti ir patvirtinti šiuos dokumentus')}
        </p>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div key={doc.id} className="border border-sand-beige rounded-lg">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-2">
                    {doc.title}
                    {doc.required && <span className="text-red-500 ml-1">*</span>}
                  </h4>
                  
                  <button
                    type="button"
                    onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
                    className="text-sage-green hover:underline text-sm flex items-center"
                  >
                    {t('documents.readDocument', 'Skaityti dokumentą')}
                    <svg 
                      className={`ml-1 h-4 w-4 transition-transform ${
                        expandedDoc === doc.id ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex items-center ml-4">
                  <input
                    type="checkbox"
                    id={`doc-${doc.id}`}
                    checked={documentsAccepted[doc.id] || false}
                    onChange={() => handleDocumentToggle(doc.id)}
                    className="text-sage-green border-sand-beige focus:ring-sage-green rounded"
                    disabled={disabled}
                  />
                  <label htmlFor={`doc-${doc.id}`} className="ml-2 text-sm">
                    {t('documents.accept', 'Sutinku')}
                  </label>
                </div>
              </div>
              
              {expandedDoc === doc.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-sand-beige/50"
                >
                  <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                    <div className="prose prose-sm">
                      <DocumentContent docId={doc.id} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-sage-green text-sage-green rounded-lg font-medium hover:bg-sage-green/5 transition-colors"
        >
          {t('back', 'Atgal')}
        </button>
        
        <button
          type="button"
          onClick={onContinue}
          disabled={!allDocumentsAccepted}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            allDocumentsAccepted
              ? 'bg-sage-green text-white hover:bg-sage-green/90'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {t('continue', 'Tęsti')}
        </button>
      </div>
    </div>
  );
};

// Document Content Component (English content as requested)
const DocumentContent = ({ docId }) => {
  const content = {
    rental: `
      <h4>Rental Agreement</h4>
      <p><strong>1. RENTAL TERMS AND CONDITIONS</strong></p>
      <p>This rental agreement governs the terms and conditions for renting a Vespa electric scooter from our company located in Nida, Lithuania.</p>
      
      <p><strong>2. RENTAL PERIOD</strong></p>
      <ul>
        <li>Minimum rental period: 4 hours (half day) or 9 hours (full day)</li>
        <li>Rental periods: Morning (9:00-13:00), Afternoon (13:00-18:00), Full day (9:00-18:00)</li>
        <li>Late returns will incur additional charges</li>
      </ul>
      
      <p><strong>3. PAYMENT AND DEPOSIT</strong></p>
      <ul>
        <li>Full payment required at time of rental</li>
        <li>Security deposit: €500 (refundable upon return in good condition)</li>
        <li>Payment methods: Cash, credit/debit cards</li>
      </ul>
      
      <p><strong>4. INSURANCE AND LIABILITY</strong></p>
      <ul>
        <li>Basic insurance coverage included</li>
        <li>Renter liable for damages not covered by insurance</li>
        <li>Third-party liability insurance recommended</li>
      </ul>
    `,
    handover: `
      <h4>Vehicle Handover Agreement</h4>
      <p><strong>1. VEHICLE INSPECTION</strong></p>
      <p>Both parties must complete a thorough inspection of the Vespa before and after rental period.</p>
      
      <p><strong>2. PRE-RENTAL CHECKLIST</strong></p>
      <ul>
        <li>Battery level and charging status</li>
        <li>Physical condition (scratches, dents, damage)</li>
        <li>Tire condition and pressure</li>
        <li>Lights and electrical systems functionality</li>
        <li>Mirrors and safety equipment</li>
      </ul>
      
      <p><strong>3. INCLUDED EQUIPMENT</strong></p>
      <ul>
        <li>Safety helmet (mandatory)</li>
        <li>GPS navigation system</li>
        <li>Basic toolkit</li>
        <li>Charging cable</li>
        <li>User manual and route maps</li>
      </ul>
      
      <p><strong>4. RETURN CONDITION</strong></p>
      <ul>
        <li>Vehicle must be returned in same condition as received</li>
        <li>Minimum 20% battery charge required</li>
        <li>All equipment must be returned</li>
        <li>Cleaning fee may apply for excessive dirt</li>
      </ul>
    `,
    safety: `
      <h4>Safety and Responsibility Rules</h4>
      <p><strong>1. DRIVER REQUIREMENTS</strong></p>
      <ul>
        <li>Minimum age: 21 years</li>
        <li>Valid driving license (AM, A1, A2, A, B or equivalent)</li>
        <li>No alcohol or substance impairment</li>
        <li>Must wear provided safety helmet at all times</li>
      </ul>
      
      <p><strong>2. TRAFFIC REGULATIONS</strong></p>
      <ul>
        <li>Maximum speed: 45 km/h</li>
        <li>Follow all local traffic laws and regulations</li>
        <li>Use designated bike lanes where available</li>
        <li>No riding on pedestrian areas or beaches</li>
        <li>Respect protected nature areas and wildlife</li>
      </ul>
      
      <p><strong>3. SAFETY RESPONSIBILITIES</strong></p>
      <ul>
        <li>Conduct pre-ride safety check</li>
        <li>Maintain safe following distance</li>
        <li>Use turn signals and follow traffic signs</li>
        <li>Avoid riding in severe weather conditions</li>
        <li>Report any mechanical issues immediately</li>
      </ul>
      
      <p><strong>4. EMERGENCY PROCEDURES</strong></p>
      <ul>
        <li>Emergency contact: +370 679 56380</li>
        <li>In case of accident: Contact emergency services (112)</li>
        <li>Report all incidents to rental company immediately</li>
        <li>Do not attempt repairs yourself</li>
      </ul>
      
      <p><strong>5. PROHIBITED ACTIVITIES</strong></p>
      <ul>
        <li>Lending the vehicle to unauthorized persons</li>
        <li>Using vehicle for commercial purposes</li>
        <li>Exceeding maximum weight capacity (150kg)</li>
        <li>Riding under influence of alcohol or drugs</li>
        <li>Off-road riding or stunts</li>
      </ul>
    `
  };

  return <div dangerouslySetInnerHTML={{ __html: content[docId] || '' }} />;
};

// Digital Signature Component
const DigitalSignature = ({ onSignatureComplete, signature, disabled = false }) => {
  const sigCanvas = useRef(null);
  const [hasSignature, setHasSignature] = useState(!!signature);

  const clearSignature = () => {
    sigCanvas.current?.clear();
    setHasSignature(false);
    onSignatureComplete(null);
  };

  const saveSignature = () => {
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current.toDataURL();
      setHasSignature(true);
      onSignatureComplete(signatureData);
    }
  };

  const handleEnd = () => {
    if (!sigCanvas.current?.isEmpty()) {
      saveSignature();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="font-medium mb-2">
          {t('signature.title', 'Skaitmeninis parašas')}
        </h4>
        <p className="text-sm text-graphite-black/70">
          {t('signature.instruction', 'Prašome pasirašyti žemiau esančiame laukelyje')}
        </p>
      </div>

      <div className="border-2 border-dashed border-sage-green/30 rounded-lg p-4 bg-gray-50">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: 'signature-canvas w-full h-32 bg-white rounded border',
            width: isMobile ? 300 : 400,
            height: 120
          }}
          onEnd={handleEnd}
          disabled={disabled}
        />
      </div>

      <div className="flex justify-center space-x-4">
        <button
          type="button"
          onClick={clearSignature}
          className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors"
          disabled={disabled}
        >
          {t('signature.clear', 'Išvalyti')}
        </button>
      </div>

      {hasSignature && (
        <div className="text-center">
          <div className="inline-flex items-center text-sage-green text-sm">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('signature.completed', 'Parašas pridėtas')}
          </div>
        </div>
      )}
    </div>
  );
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
          <span className="inline-block font-syne uppercase tracking-wider text-sage-green mb-2 text-sm">{t('booking.subtitle')}</span>
          <h2 className="text-3xl md:text-5xl font-bold font-syne text-graphite-black">{t('booking.title')}</h2>
          <div className="w-24 h-1 bg-sage-green mx-auto mt-6 mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-graphite-black/70">
            {t('booking.description')}
          </p>
          <NotifyModal />
        </motion.div>
        
        {isMobile ? (
          // Mobile version with toggle button
          <div className="flex flex-col items-center">
            <ToggleButton 
              isOpen={showBookingForm}
              onClick={() => setShowBookingForm(!showBookingForm)}
              showText={t('booking.showForm')} 
              hideText={t('booking.hideForm')}
              scrollToId="booking-form-steps"
              className="w-full max-w-xs mb-8"
            />
            
            {/* Featured Vespa Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-xs mb-6"
            >
              <div className="aspect-square overflow-hidden rounded-xl shadow-md relative">
                <Image
                  src={vespaModels[0].image}
                  alt={vespaModels[0].name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold font-syne text-lg mb-1">{vespaModels[0].name}</h3>
                  <div className="flex justify-between items-center text-white mb-2">
                    <p className="opacity-80 text-sm">{vespaModels[0].color}</p>
                    <div className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded">
                      <span className="line-through opacity-60">€{vespaModels[0].originalPrice}</span>
                      <span className="ml-1">€{vespaModels[0].price}/diena</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-white/80">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>{vespaModels[0].power}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 113 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span>{vespaModels[0].range}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Expandable Booking Form */}
            <AnimatePresence>
              {showBookingForm && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full overflow-hidden"
                  id="booking-form"
                >
                  {/* Success message */}
                  <AnimatePresence mode="wait">
                    {success ? (
                      <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white p-6 rounded-xl shadow-md text-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-sage-green/20 flex items-center justify-center mx-auto mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        
                        <h3 className="text-xl font-bold font-syne mb-3">Užsakymas pateiktas!</h3>
                        <p className="text-graphite-black/70 mb-6 text-sm">
                          Dėkojame už užsakymą. Netrukus susisieksime su jumis.
                        </p>
                        
                        <div className="p-4 bg-sage-green/5 rounded-lg mb-6 text-xs">
                          <p className="text-graphite-black/70">
                            Patvirtinimo laiškas išsiųstas į jūsų el. pašto adresą.
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => setSuccess(false)} 
                          className="btn-primary text-sm py-3 px-6 w-full mb-3"
                        >
                          Naujas užsakymas
                        </button>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-xl shadow-md"
                        id="booking-form-steps"
                      >
                        {error && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center text-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                          </motion.div>
                        )}
                        
                        {/* Mobile step indicators */}
                        <div className="flex justify-center mb-6">
                          {[1, 2, 3, 4].map((step) => ( 
                            <div 
                              key={step} 
                              className={`w-3 h-3 mx-1 rounded-full ${
                                currentStep === step 
                                  ? 'bg-sage-green' 
                                  : currentStep > step 
                                  ? 'bg-sage-green/30' 
                                  : 'bg-graphite-black/20'
                              }`}
                            ></div>
                          ))}
                        </div>
                        
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
                              <h3 className="text-lg font-bold mb-4 font-syne">Pasirinkite Vespa</h3>
                              
                              <div className="grid grid-cols-1 gap-4 mb-6">
                                {vespaModels.map((model) => (
                                  <div 
                                    key={model.id}
                                    className={`border rounded-lg p-2 cursor-pointer transition-all duration-300 relative ${
                                      formData.model === model.name && !model.comingSoon
                                        ? 'border-sage-green ring-1 ring-sage-green bg-sage-green/5' 
                                        : model.comingSoon
                                        ? 'border-sand-beige bg-sand-beige/5 opacity-80'
                                        : 'border-sand-beige hover:border-sage-green'
                                    }`}
                                    onClick={() => !model.comingSoon && setFormData(prev => ({ ...prev, model: model.name }))}
                                  >
                                    {/* Coming Soon Badge */}
                                    {model.comingSoon && (
                                      <div className="absolute top-2 right-2 z-10 bg-graphite-black/80 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                                        Netrukus
                                      </div>
                                    )}
                                    
                                    <div className="flex items-center">
                                      <div className="relative w-16 h-16 rounded overflow-hidden">
                                        <Image
                                          src={model.image}
                                          alt={model.name}
                                          fill
                                          className={`object-cover ${model.comingSoon ? 'opacity-90' : ''}`}
                                          sizes="64px"
                                        />
                                      </div>
                                      <div className="ml-3 flex-1">
                                        <div className="flex justify-between items-start">
                                          <h4 className="font-syne font-bold text-sm">{model.name}</h4>
                                          <div 
                                            className="w-3 h-3 rounded-full mt-1" 
                                            style={{ 
                                              backgroundColor: model.color === 'Baltas' ? '#F9F7F1' : 
                                                            model.color === 'Žalias' ? '#9AA89C' : '#E9DCC9' 
                                            }}
                                          ></div>
                                        </div>
                                        <p className="text-xs text-sage-green">{model.color}</p>
                                        <div className="flex justify-between items-center mt-1">
                                          <span className="text-xs text-graphite-black/70">{model.power}</span>
                                          <div className="text-xs font-bold">
                                            <span className="line-through text-graphite-black/50">€{model.originalPrice}</span>
                                            <span className="ml-1 text-sage-green">€{model.price}/diena</span>
                                          </div>
                                        </div>
                                        
                                        {/* Notify button for Coming Soon models (mobile) */}
                                        {model.comingSoon && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleNotifyClick(model.id);
                                            }}
                                            className="mt-2 text-xs text-sage-green flex items-center w-full justify-center py-1 border border-sage-green rounded"
                                          >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                            Pranešti man
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <button 
                                type="button" 
                                onClick={nextStep}
                                className="btn-primary w-full py-3 text-sm flex items-center justify-center"
                              >
                                <span>Tęsti</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </motion.div>
                          )}
                          
                          {/* Step 2: Date Selection with Calendar */}
                          {currentStep === 2 && (
                            <motion.div
                              key="step2"
                              variants={formVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                            >
                              <h3 className="text-lg font-bold mb-4 font-syne">Pasirinkite datą</h3>
                              
                              <div className="space-y-4 mb-6">
                                {/* Calendar Component */}
                                <div>
                                  <label className="block mb-2 text-sm font-medium">Nuomos data</label>
                                  <BookingCalendar
                                    selectedDate={formData.startDate}
                                    onDateSelect={handleCalendarDateSelect}
                                    adminMode={false}
                                  />
                                  <p className="mt-2 text-xs text-graphite-black/50">
                                    Nuomojame tik vienai dienai
                                  </p>
                                </div>

                                {/* Date Warning */}
                                {showDateWarning && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
                                  >
                                    <div className="flex items-start">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                      </svg>
                                      <div>
                                        <p className="text-sm text-amber-800 font-medium">Pastaba apie datas</p>
                                        <p className="text-xs text-amber-700 mt-1">
                                          Šiuo metu nuomojame tik vienai dienai. Ilgesnės nuomos klausimais susisiekite telefonu.
                                        </p>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Rental Type Selection */}
                                {formData.startDate && !showDateWarning && (
                                  <div>
                                    <label className="block mb-2 text-sm font-medium">Nuomos trukmė</label>
                                    <div className="space-y-2">
                                      <div className="flex items-center p-3 border border-sand-beige rounded-lg hover:border-sage-green transition-colors">
                                        <input
                                          type="radio"
                                          id="full-day"
                                          name="rentalType"
                                          value="full"
                                          checked={formData.rentalType === 'full'}
                                          onChange={handleChange}
                                          className="text-sage-green border-sand-beige focus:ring-sage-green"
                                        />
                                        <label htmlFor="full-day" className="ml-3 flex-1 cursor-pointer">
                                          <div className="flex justify-between items-center">
                                            <div>
                                              <p className="text-sm font-medium">Visa diena</p>
                                              <p className="text-xs text-graphite-black/60">9:00 - 18:00</p>
                                            </div>
                                            <div className="text-sm font-bold">
                                              <span className="line-through text-graphite-black/50">€69</span>
                                              <span className="ml-1 text-sage-green">€59</span>
                                            </div>
                                          </div>
                                        </label>
                                      </div>

                                      <div className="flex items-center p-3 border border-sand-beige rounded-lg hover:border-sage-green transition-colors">
                                        <input
                                          type="radio"
                                          id="morning"
                                          name="rentalType"
                                          value="morning"
                                          checked={formData.rentalType === 'morning'}
                                          onChange={handleChange}
                                          className="text-sage-green border-sand-beige focus:ring-sage-green"
                                        />
                                        <label htmlFor="morning" className="ml-3 flex-1 cursor-pointer">
                                          <div className="flex justify-between items-center">
                                            <div>
                                              <p className="text-sm font-medium">Pirmoji dienos pusė</p>
                                              <p className="text-xs text-graphite-black/60">9:00 - 13:00</p>
                                            </div>
                                            <div className="text-sm font-bold">
                                              <span className="line-through text-graphite-black/50">€59</span>
                                              <span className="ml-1 text-sage-green">€49</span>
                                            </div>
                                          </div>
                                        </label>
                                      </div>

                                      <div className="flex items-center p-3 border border-sand-beige rounded-lg hover:border-sage-green transition-colors">
                                        <input
                                          type="radio"
                                          id="evening"
                                          name="rentalType"
                                          value="evening"
                                          checked={formData.rentalType === 'evening'}
                                          onChange={handleChange}
                                          className="text-sage-green border-sand-beige focus:ring-sage-green"
                                        />
                                        <label htmlFor="evening" className="ml-3 flex-1 cursor-pointer">
                                          <div className="flex justify-between items-center">
                                            <div>
                                              <p className="text-sm font-medium">Antroji dienos pusė</p>
                                              <p className="text-xs text-graphite-black/60">13:00 - 18:00</p>
                                            </div>
                                            <div className="text-sm font-bold">
                                              <span className="line-through text-graphite-black/50">€59</span>
                                              <span className="ml-1 text-sage-green">€49</span>
                                            </div>
                                          </div>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Helmet Selection */}
                                {formData.startDate && !showDateWarning && (
                                  <div>
                                    <label className="block mb-2 text-sm font-medium">Šalmų pasirinkimas</label>
                                    <div className="p-3 bg-sage-green/5 rounded-lg">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm">Šalmas įskaičiuotas</span>
                                        <span className="text-sm font-medium text-sage-green">Nemokamai</span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                          <input
                                            type="checkbox"
                                            id="additionalHelmet"
                                            name="additionalHelmet"
                                            checked={formData.additionalHelmet}
                                            onChange={handleChange}
                                            className="text-sage-green border-sand-beige focus:ring-sage-green rounded"
                                          />
                                          <label htmlFor="additionalHelmet" className="ml-2 text-sm">
                                            Papildomas šalmas
                                          </label>
                                        </div>
                                        <span className="text-sm font-medium">€10</span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                <div>
                                  <label htmlFor="route" className="block mb-1 text-sm font-medium">Maršrutas</label>
                                  <select
                                    id="route"
                                    name="route"
                                    value={formData.route}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                  >
                                    <option value="" disabled>Pasirinkite maršrutą</option>
                                    {routeOptions.map(route => (
                                      <option key={route.id} value={route.id}>{route.name}</option>
                                    ))}
                                  </select>
                                  <p className="mt-1 text-xs text-graphite-black/50">GPS navigacija įskaičiuota</p>
                                </div>
                              </div>
                              
                              {/* Price calculation */}
                              {rentalPrice > 0 && (
                                <motion.div 
                                  className="mb-6 p-4 bg-sage-green/5 rounded-lg"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <h4 className="font-syne font-bold text-sm mb-2">Nuomos suvestinė</h4>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                      <span>
                                        {formData.rentalType === 'full' ? 'Visa diena' : 
                                         formData.rentalType === 'morning' ? 'Pirmoji dienos pusė' : 'Antroji dienos pusė'}
                                      </span>
                                      <span>€{formData.rentalType === 'full' ? '59' : '49'}</span>
                                    </div>
                                    
                                    {formData.additionalHelmet && (
                                      <div className="flex justify-between">
                                        <span>Papildomas šalmas</span>
                                        <span>€10</span>
                                      </div>
                                    )}
                                    
                                    <div className="flex justify-between font-bold pt-1 border-t border-sage-green/20 mt-1">
                                      <span>Iš viso</span>
                                      <span>€{rentalPrice}</span>
                                    </div>
                                  </div>
                                  <p className="mt-2 text-2xs text-graphite-black/60">
                                    *Užstatas €500 bus grąžintas po nuomos
                                  </p>
                                </motion.div>
                              )}
                              
                              <div className="flex space-x-3">
                                <button 
                                  type="button" 
                                  onClick={prevStep}
                                  className="px-4 py-2.5 flex-1 border border-sage-green text-sage-green rounded text-sm font-medium"
                                >
                                  Atgal
                                </button>
                                
                                <button 
                                  type="button" 
                                  onClick={nextStep}
                                  className={`btn-primary py-2.5 flex-1 text-sm ${
                                    !formData.startDate || showDateWarning ? 'opacity-50 cursor-not-allowed' : ''
                                  }`}
                                  disabled={!formData.startDate || showDateWarning}
                                >
                                  Tęsti
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
                              <h3 className="text-lg font-bold mb-4 font-syne">Asmeninė informacija</h3>
                              
                              <div className="space-y-4 mb-6">
                                <div>
                                  <label htmlFor="name" className="block mb-1 text-sm font-medium">Vardas ir pavardė</label>
                                  <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                    placeholder="Vardas Pavardė"
                                  />
                                </div>
                                
                                <div>
                                  <label htmlFor="email" className="block mb-1 text-sm font-medium">El. paštas</label>
                                  <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                    placeholder="vardas@pavyzdys.lt"
                                  />
                                </div>
                                
                                <div>
                                  <label htmlFor="phone" className="block mb-1 text-sm font-medium">Telefonas</label>
                                  <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                    placeholder="+370 6XX XXXXX"
                                  />
                                  <p className="mt-1 text-xs text-graphite-black/50">SMS patvirtinimui</p>
                                </div>

                                <div>
                                  <label htmlFor="age" className="block mb-1 text-sm font-medium">Amžius</label>
                                  <select
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                  >
                                    <option value="">Pasirinkite amžių</option>
                                    {ageOptions.map(age => (
                                      <option key={age} value={age}>{age}</option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label htmlFor="drivingLicense" className="block mb-1 text-sm font-medium">Vairuotojo pažymėjimas</label>
                                  <select
                                    id="drivingLicense"
                                    name="drivingLicense"
                                    value={formData.drivingLicense}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                  >
                                    <option value="">Pasirinkite kategoriją</option>
                                    {drivingLicenseOptions.map(license => (
                                      <option key={license.value} value={license.value}>{license.label}</option>
                                    ))}
                                  </select>
                                  
                                  {formData.drivingLicense && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: -10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                                    >
                                      <div className="flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="text-sm">
                                          <p className="font-medium text-blue-800 mb-1">Vairuotojo pažymėjimo reikalavimai</p>
                                          <p className="text-blue-700 text-xs">
                                            Lietuvos vairuotojo pažymėjimas arba tarptautinis pažymėjimas.
                                          </p>
                                          <p className="text-blue-700 text-xs mt-1">
                                            Alternatyviai: ES šalių pažymėjimai.
                                          </p>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                                
                                <div>
                                  <label htmlFor="message" className="block mb-1 text-sm font-medium">Papildoma informacija</label>
                                  <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 text-sm border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                                    placeholder="Ypatingi pageidavimai ar klausimai..."
                                  ></textarea>
                                </div>
                              </div>
                              
                              {/* Booking summary */}
                              <div className="mb-6 p-4 bg-sage-green/5 rounded-lg">
                                <h4 className="font-syne font-bold text-sm mb-3">Užsakymo suvestinė</h4>
                                <div className="space-y-2 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-graphite-black/60">Modelis:</span>
                                    <span className="font-medium">{formData.model}</span>
                                  </div>
                                  
                                  <div className="flex justify-between">
                                    <span className="text-graphite-black/60">Trukmė:</span>
                                    <span className="font-medium">
                                      {formData.rentalType === 'full' ? 'Visa diena (9:00-18:00)' : 
                                       formData.rentalType === 'morning' ? 'Pirmoji pusė (9:00-13:00)' : 
                                       formData.rentalType === 'evening' ? 'Antroji pusė (13:00-18:00)' : 'Nepasirinkta'}
                                    </span>
                                  </div>
                                  
                                  <div className="flex justify-between">
                                    <span className="text-graphite-black/60">Data:</span>
                                    <span className="font-medium">
                                      {formData.startDate ? new Date(formData.startDate).toLocaleDateString('lt-LT') : 'Nepasirinkta'}
                                    </span>
                                  </div>
                                  
                                  <div className="flex justify-between pt-2 border-t border-sage-green/20 mt-1">
                                    <span className="text-graphite-black/60">Iš viso mokėti:</span>
                                    <span className="font-bold">€{rentalPrice} + €500</span>
                                  </div>
                                  
                                  <p className="text-2xs text-graphite-black/60 mt-2">
                                    *€500 užstatas grąžinamas po nuomos
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mb-6 flex items-start">
                                <input 
                                  type="checkbox" 
                                  id="terms" 
                                  className="mt-1 border-sand-beige text-sage-green focus:ring-sage-green rounded" 
                                  required 
                                />
                                <label htmlFor="terms" className="ml-3 text-xs text-graphite-black/70">
                                  Sutinku su <a href="#" className="text-sage-green hover:underline">nuomos sąlygomis</a> ir{' '}
                                  <a href="#" className="text-sage-green hover:underline">privatumo politika</a>.
                                </label>
                              </div>
                              
                              <div className="flex space-x-3">
                                <button 
                                  type="button" 
                                  onClick={prevStep}
                                  className="px-4 py-2.5 flex-1 border border-sage-green text-sage-green rounded text-sm font-medium"
                                >
                                  Atgal
                                </button>
                                
                                <button 
  type="button"  // Changed from "submit" to "button"
  onClick={nextStep}  // Changed from handleSubmit to nextStep
  className="btn-primary py-2.5 flex-1 text-sm"
  disabled={loading}
>
  <span>Tęsti</span>
</button>
                              </div>
                            </motion.div>
                          )}
                          {currentStep === 4 && (
  <motion.div
    key="step4"
    variants={formVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    <DocumentReview
      documentsAccepted={formData.documentsAccepted}
      onDocumentAccept={(docId, accepted) => {
        setFormData(prev => ({
          ...prev,
          documentsAccepted: {
            ...prev.documentsAccepted,
            [docId]: accepted
          },
          documentsReadAt: accepted ? new Date().toISOString() : prev.documentsReadAt
        }));
      }}
      onContinue={() => {
        // Move to next step or submit form
        setCurrentStep(prev => prev + 1);
      }}
      onBack={prevStep}
    />
    
    <div className="mt-8">
      <DigitalSignature
        signature={formData.digitalSignature}
        onSignatureComplete={(signature) => {
          setFormData(prev => ({
            ...prev,
            digitalSignature: signature
          }));
        }}
      />
    </div>

    {/* Submit button for Step 4 */}
    <div className="flex space-x-3 mt-8">
      <button 
        type="button" 
        onClick={prevStep}
        className="px-4 py-2.5 flex-1 border border-sage-green text-sage-green rounded text-sm font-medium"
      >
        Atgal
      </button>
      
      <button 
        type="submit" 
        className="btn-primary py-2.5 flex-1 text-sm"
        disabled={loading || !Object.values(formData.documentsAccepted).every(Boolean)}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Pateikiama...</span>
          </>
        ) : (
          <span>Pateikti užsakymą</span>
        )}
      </button>
    </div>
  </motion.div>
)}
                        </AnimatePresence>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          // Desktop version with integrated calendar
          <div className="max-w-5xl mx-auto" id="booking-form">
            {/* Form progress steps */}
            <motion.div 
              className="mb-8 hidden md:block"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex justify-center items-center">
  {[1, 2, 3, 4].map((step) => (
    <div key={step} className="flex items-center">
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
          currentStep === step 
            ? 'bg-sage-green text-white' 
            : currentStep > step ? 'bg-sage-green/20 text-sage-green' 
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
        {step === 1 ? 'Vespa pasirinkimas' : 
         step === 2 ? 'Datos ir detalės' : 
         step === 3 ? 'Asmeninė informacija' :
         'Dokumentai ir parašas'}
      </div>
      
     {step < 4 && (
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
                  
                  <h3 className="text-3xl font-bold font-syne mb-4">Užsakymas pateiktas sėkmingai!</h3>
                  <p className="text-lg text-graphite-black/70 mb-8 max-w-md mx-auto">
                    Dėkojame už užsakymą. Netrukus susisieksime su jumis patvirtinti detales.
                  </p>
                  
                  <div className="p-6 bg-sage-green/5 rounded-lg mb-8">
                    <p className="text-sm text-graphite-black/70">
                      Patvirtinimo laiškas išsiųstas į jūsų el. pašto adresą.
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => setSuccess(false)} 
                      className="btn-primary"
                    >
                      Naujas užsakymas
                    </button>
                    
                    <a href="#explore" className="px-6 py-3 border border-sage-green text-sage-green rounded font-medium hover:bg-sage-green/5 transition-colors">
                      Tyrinėti maršrutus
                    </a>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="bg-white p-8 md:p-12 rounded-2xl shadow-lg"
                  id="booking-form-steps"
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
                        <h3 className="text-xl font-bold mb-6 font-syne">Pasirinkite Vespa modelį</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          {vespaModels.map((model) => (
                            <div 
                              key={model.id}
                              className={`border rounded-xl p-2 cursor-pointer transition-all duration-300 relative ${
                                formData.model === model.name && !model.comingSoon
                                  ? 'border-sage-green ring-1 ring-sage-green bg-sage-green/5' 
                                  : model.comingSoon
                                  ? 'border-sand-beige bg-sand-beige/5 opacity-80'
                                  : 'border-sand-beige hover:border-sage-green'
                              }`}
                              onClick={() => !model.comingSoon && setFormData(prev => ({ ...prev, model: model.name }))}
                              onMouseEnter={() => setModelHovered(model.id)}
                              onMouseLeave={() => setModelHovered(null)}
                            >
                              {/* Coming Soon Badge */}
                              {model.comingSoon && (
                                <div className="absolute top-2 right-2 z-10 bg-graphite-black/80 text-white px-3 py-1 rounded-full text-xs font-bold">
                                  Netrukus
                                </div>
                              )}
                              
                              <div className="relative h-40 mb-3 rounded-lg overflow-hidden">
                                <Image
                                  src={model.image}
                                  alt={model.name}
                                  fill
                                  className={`object-cover ${model.comingSoon ? 'opacity-90' : ''}`}
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-0.5 rounded text-xs font-bold">
                                  <span className="line-through opacity-60">€{model.originalPrice}</span>
                                  <span className="ml-1 text-sage-green">€{model.price}/diena</span>
                                </div>
                              </div>
                              
                              <div className="px-2">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-syne font-bold">{model.name}</h4>
                                  <div 
                                    className="w-3 h-3 rounded-full mt-1" 
                                    style={{ 
                                      backgroundColor: model.color === 'Baltas' ? '#F9F7F1' : 
                                                    model.color === 'Žalias' ? '#9AA89C' : '#E9DCC9' 
                                    }}
                                  ></div>
                                </div>
                                <p className="text-xs text-sage-green mb-2">{model.color}</p>
                                
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-graphite-black/70">
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <span>{model.power}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 113 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    <span>{model.range}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>{model.maxSpeed}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 113 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    <span>{model.idealFor}</span>
                                  </div>
                                </div>
                                
                                {/* Notify button for Coming Soon models (desktop) */}
                                {model.comingSoon && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNotifyClick(model.id);
                                    }}
                                    className="mt-3 text-sm text-sage-green flex items-center w-full justify-center py-2 border border-sage-green rounded hover:bg-sage-green/5"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    Pranešti man
                                  </button>
                                )}
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
                            <span>Tęsti datos pasirinkimą</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Step 2: Date Selection with Calendar (Desktop) */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <h3 className="text-xl font-bold mb-6 font-syne">Pasirinkite datą ir detales</h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                          {/* Calendar Section */}
                          <div>
                            <label className="block mb-3 text-sm font-medium">Nuomos data</label>
                            <BookingCalendar
                              selectedDate={formData.startDate}
                              onDateSelect={handleCalendarDateSelect}
                              adminMode={false}
                            />
                            <p className="mt-3 text-sm text-graphite-black/50">
                              Nuomojame tik vienai dienai. Ilgesnės nuomos klausimais susisiekite telefonu.
                            </p>
                          </div>

                          {/* Details Section */}
                          <div className="space-y-6">
                            {/* Date Warning */}
                            {showDateWarning && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-amber-50 border border-amber-200 rounded-lg"
                              >
                                <div className="flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                  </svg>
                                  <div>
                                    <p className="text-base text-amber-800 font-medium">Pastaba apie datas</p>
                                    <p className="text-sm text-amber-700 mt-1">
                                      Šiuo metu nuomojame tik vienai dienai. Ilgesnės nuomos klausimais susisiekite telefonu.
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}

                            {/* Rental Type Selection */}
                            {formData.startDate && !showDateWarning && (
                              <div>
                                <label className="block mb-3 text-sm font-medium">Nuomos trukmė</label>
                                <div className="space-y-3">
                                  <div className="flex items-center p-4 border border-sand-beige rounded-lg hover:border-sage-green transition-colors">
                                    <input
                                      type="radio"
                                      id="full-day-desktop"
                                      name="rentalType"
                                      value="full"
                                      checked={formData.rentalType === 'full'}
                                      onChange={handleChange}
                                      className="text-sage-green border-sand-beige focus:ring-sage-green"
                                    />
                                    <label htmlFor="full-day-desktop" className="ml-3 flex-1 cursor-pointer">
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <p className="font-medium">Visa diena</p>
                                          <p className="text-sm text-graphite-black/60">9:00 - 18:00</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="line-through text-graphite-black/50 text-sm">€69</p>
                                          <p className="font-bold text-sage-green">€59</p>
                                        </div>
                                      </div>
                                    </label>
                                  </div>

                                  <div className="flex items-center p-4 border border-sand-beige rounded-lg hover:border-sage-green transition-colors">
                                    <input
                                      type="radio"
                                      id="morning-desktop"
                                      name="rentalType"
                                      value="morning"
                                      checked={formData.rentalType === 'morning'}
                                      onChange={handleChange}
                                      className="text-sage-green border-sand-beige focus:ring-sage-green"
                                    />
                                    <label htmlFor="morning-desktop" className="ml-3 flex-1 cursor-pointer">
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <p className="font-medium">Pirmoji dienos pusė</p>
                                          <p className="text-sm text-graphite-black/60">9:00 - 13:00</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="line-through text-graphite-black/50 text-sm">€59</p>
                                          <p className="font-bold text-sage-green">€49</p>
                                        </div>
                                      </div>
                                    </label>
                                  </div>

                                  <div className="flex items-center p-4 border border-sand-beige rounded-lg hover:border-sage-green transition-colors">
                                    <input
                                      type="radio"
                                      id="evening-desktop"
                                      name="rentalType"
                                      value="evening"
                                      checked={formData.rentalType === 'evening'}
                                      onChange={handleChange}
                                      className="text-sage-green border-sand-beige focus:ring-sage-green"
                                    />
                                    <label htmlFor="evening-desktop" className="ml-3 flex-1 cursor-pointer">
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <p className="font-medium">Antroji dienos pusė</p>
                                          <p className="text-sm text-graphite-black/60">13:00 - 18:00</p>
                                        </div>
                                        <div className="text-right">
                                          <p className="line-through text-graphite-black/50 text-sm">€59</p>
                                          <p className="font-bold text-sage-green">€49</p>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Helmet Selection */}
                            {formData.startDate && !showDateWarning && (
                              <div>
                                <label className="block mb-3 text-sm font-medium">Šalmų pasirinkimas</label>
                                <div className="p-4 bg-sage-green/5 rounded-lg">
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">Šalmas įskaičiuotas</span>
                                      <span className="font-bold text-sage-green">Nemokamai</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center">
                                        <input
                                          type="checkbox"
                                          id="additionalHelmet-desktop"
                                          name="additionalHelmet"
                                          checked={formData.additionalHelmet}
                                          onChange={handleChange}
                                          className="text-sage-green border-sand-beige focus:ring-sage-green rounded"
                                        />
                                        <label htmlFor="additionalHelmet-desktop" className="ml-2">
                                          Papildomas šalmas
                                        </label>
                                      </div>
                                      <span className="font-bold">€10</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {/* Route Selection */}
                            <div>
                              <label htmlFor="route-desktop" className="block mb-2 text-sm font-medium">Maršrutas</label>
                              <select
                                id="route-desktop"
                                name="route"
                                value={formData.route}
                                onChange={handleChange}
                                className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                              >
                                <option value="" disabled>Pasirinkite maršrutą</option>
                                {routeOptions.map(route => (
                                  <option key={route.id} value={route.id}>{route.name}</option>
                                ))}
                              </select>
                              <p className="mt-2 text-sm text-graphite-black/50">GPS navigacija įskaičiuota</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Price calculation */}
                        {rentalPrice > 0 && (
                          <motion.div 
                            className="mb-8 p-6 bg-sage-green/5 rounded-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <h4 className="font-syne font-bold text-lg mb-4">Nuomos suvestinė</h4>
                            <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span>
                                    {formData.rentalType === 'full' ? 'Visa diena (9:00-18:00)' : 
                                     formData.rentalType === 'morning' ? 'Pirmoji pusė (9:00-13:00)' : 'Antroji pusė (13:00-18:00)'}
                                  </span>
                                  <span>€{formData.rentalType === 'full' ? '59' : '49'}</span>
                                </div>
                                
                                {formData.additionalHelmet && (
                                  <div className="flex justify-between">
                                    <span>Papildomas šalmas</span>
                                    <span>€10</span>
                                  </div>
                                )}
                                
                                <div className="flex justify-between font-bold pt-3 border-t border-sage-green/20 mt-2 text-lg">
                                  <span>Tarpinė suma</span>
                                  <span>€{rentalPrice}</span>
                                </div>
                                
                                <div className="flex justify-between text-sm text-graphite-black/70">
                                  <span>Užstatas</span>
                                  <span>€500</span>
                                </div>
                                
                                <div className="flex justify-between font-bold text-xl pt-2 border-t border-sage-green/30">
                                  <span>Iš viso mokėti</span>
                                  <span>€{rentalPrice + 500}</span>
                                </div>
                              </div>
                              
                              <div className="bg-white/60 p-4 rounded">
                                <h5 className="font-medium mb-3">Mokėjimo informacija</h5>
                                <div className="space-y-2 text-sm text-graphite-black/70">
                                  <p>Pilnas mokėjimas reikalingas iš anksto</p>
                                  <p>Užstatas įskaičiuotas į bendrą sumą</p>
                                  <p>Užstatas grąžinamas po nuomos</p>
                                  <p>Priimame korteles ir grynuosius</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        <div className="flex justify-between mt-8">
                          <button 
                            type="button" 
                            onClick={prevStep}
                            className="px-6 py-3 border border-sage-green text-sage-green rounded-lg font-medium hover:bg-sage-green/5 transition-colors"
                          >
                            Atgal
                          </button>
                          
                          <button 
                            type="button" 
                            onClick={nextStep}
                            className={`btn-primary px-6 py-3 ${
                              !formData.startDate || showDateWarning ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={!formData.startDate || showDateWarning}
                          >
                            Tęsti
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Personal Information (Desktop) */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        variants={formVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <h3 className="text-xl font-bold mb-6 font-syne">Asmeninė informacija</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                          <div>
                            <label htmlFor="name-desktop" className="block mb-2 text-sm font-medium">Vardas ir pavardė</label>
                            <input
                              type="text"
                              id="name-desktop"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                              placeholder="Vardas Pavardė"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="email-desktop" className="block mb-2 text-sm font-medium">El. paštas</label>
                            <input
                              type="email"
                              id="email-desktop"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                              placeholder="vardas@pavyzdys.lt"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="phone-desktop" className="block mb-2 text-sm font-medium">Telefonas</label>
                            <input
                              type="tel"
                              id="phone-desktop"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                              placeholder="+370 6XX XXXXX"
                            />
                            <p className="mt-2 text-sm text-graphite-black/50">SMS patvirtinimui</p>
                          </div>

                          <div>
                            <label htmlFor="age-desktop" className="block mb-2 text-sm font-medium">Amžius</label>
                            <select
                              id="age-desktop"
                              name="age"
                              value={formData.age}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                            >
                              <option value="">Pasirinkite amžių</option>
                              {ageOptions.map(age => (
                                <option key={age} value={age}>{age}</option>
                              ))}
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label htmlFor="drivingLicense-desktop" className="block mb-2 text-sm font-medium">Vairuotojo pažymėjimas</label>
                            <select
                              id="drivingLicense-desktop"
                              name="drivingLicense"
                              value={formData.drivingLicense}
                              onChange={handleChange}
                              required                          className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                            >
                              <option value="">Pasirinkite kategoriją</option>
                              {drivingLicenseOptions.map(license => (
                                <option key={license.value} value={license.value}>{license.label}</option>
                              ))}
                            </select>
                            
                            {formData.drivingLicense && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                              >
                                <div className="flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <div>
                                    <p className="font-medium text-blue-800 mb-2">Vairuotojo pažymėjimo reikalavimai</p>
                                    <p className="text-blue-700 text-sm mb-2">
                                      Lietuvos vairuotojo pažymėjimas arba tarptautinis pažymėjimas.
                                    </p>
                                    <p className="text-blue-700 text-sm">
                                      Alternatyviai: ES šalių pažymėjimai.
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                          
                          <div className="md:col-span-2">
                            <label htmlFor="message-desktop" className="block mb-2 text-sm font-medium">Papildoma informacija</label>
                            <textarea
                              id="message-desktop"
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              rows="4"
                              className="w-full px-4 py-3 text-base border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green"
                              placeholder="Ypatingi pageidavimai ar klausimai..."
                            ></textarea>
                          </div>
                        </div>
                        
                        {/* Booking summary */}
                        <div className="mb-8 p-6 bg-sage-green/5 rounded-lg">
                          <h4 className="font-syne font-bold text-lg mb-4">Užsakymo suvestinė</h4>
                          <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Modelis:</span>
                                <span className="font-medium">{formData.model}</span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Trukmė:</span>
                                <span className="font-medium">
                                  {formData.rentalType === 'full' ? 'Visa diena (9:00-18:00)' : 
                                   formData.rentalType === 'morning' ? 'Pirmoji pusė (9:00-13:00)' : 
                                   formData.rentalType === 'evening' ? 'Antroji pusė (13:00-18:00)' : 'Nepasirinkta'}
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Data:</span>
                                <span className="font-medium">
                                  {formData.startDate ? new Date(formData.startDate).toLocaleDateString('lt-LT') : 'Nepasirinkta'}
                                </span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Amžius:</span>
                                <span className="font-medium">{formData.age || 'Nepasirinkta'}</span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Pažymėjimas:</span>
                                <span className="font-medium">{formData.drivingLicense || 'Nepasirinkta'}</span>
                              </div>
                              
                              <div className="flex justify-between pt-3 border-t border-sage-green/20 mt-2">
                                <span className="text-graphite-black/60">Tarpinė suma:</span>
                                <span className="font-bold">€{rentalPrice}</span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Užstatas:</span>
                                <span className="font-bold">€500</span>
                              </div>
                              
                              <div className="flex justify-between pt-2 border-t border-sage-green/30 text-lg">
                                <span className="text-graphite-black/60">Iš viso mokėti:</span>
                                <span className="font-bold">€{rentalPrice + 500}</span>
                              </div>
                            </div>
                            
                            <div className="bg-white/60 p-4 rounded">
                              <h5 className="font-medium mb-3">Svarbūs priminjimai</h5>
                              <div className="space-y-2 text-sm text-graphite-black/70">
                                <div className="flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sage-green mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  </svg>
                                  <span>Šalmas įskaičiuotas į kainą</span>
                                </div>
                                <div className="flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sage-green mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  </svg>
                                  <span>Mokėjimas kartele arba grynaisiais</span>
                                </div>
                                <div className="flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sage-green mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  </svg>
                                  <span>Užstatas grąžinamas po nuomos</span>
                                </div>
                                <div className="flex items-start">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sage-green mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                  </svg>
                                  <span>Maksimaliai vienai dienai</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-8 flex items-start">
                          <input 
                            type="checkbox" 
                            id="terms-desktop" 
                            className="mt-1 border-sand-beige text-sage-green focus:ring-sage-green rounded" 
                            required 
                          />
                          <label htmlFor="terms-desktop" className="ml-3 text-sm text-graphite-black/70">
                            Sutinku su <a href="#" className="text-sage-green hover:underline">nuomos sąlygomis</a> ir{' '}
                            <a href="#" className="text-sage-green hover:underline">privatumo politika</a>.
                          </label>
                        </div>
                        
                        <div className="flex justify-between mt-8">
                          <button 
                            type="button" 
                            onClick={prevStep}
                            className="px-6 py-3 border border-sage-green text-sage-green rounded-lg font-medium hover:bg-sage-green/5 transition-colors"
                          >
                            Atgal
                          </button>
                          
                          <button 
  type="button"  // Changed from "submit" to "button"
  onClick={nextStep}  // This should go to step 4
  className="btn-primary px-6 py-3"
  disabled={loading}
>
  <span>Tęsti</span>
</button>
                        </div>
                      </motion.div>
                    )}

                  {currentStep === 4 && (
  <motion.div
    key="step4"
    variants={formVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >
    <h3 className="text-xl font-bold mb-6 font-syne">Dokumentų peržiūra ir parašas</h3>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Document Review Section */}
      <div>
        <DocumentReview
          documentsAccepted={formData.documentsAccepted}
          onDocumentAccept={(docId, accepted) => {
            setFormData(prev => ({
              ...prev,
              documentsAccepted: {
                ...prev.documentsAccepted,
                [docId]: accepted
              },
              documentsReadAt: accepted ? new Date().toISOString() : prev.documentsReadAt
            }));
          }}
          onContinue={() => {}}
          onBack={() => {}}
        />
      </div>
      
      {/* Digital Signature Section */}
      <div>
        <DigitalSignature
          signature={formData.digitalSignature}
          onSignatureComplete={(signature) => {
            setFormData(prev => ({
              ...prev,
              digitalSignature: signature
            }));
          }}
        />
        
        {/* Final booking summary for desktop */}
        <div className="mt-8 p-6 bg-sage-green/5 rounded-lg">
          <h4 className="font-syne font-bold text-lg mb-4">Galutinė užsakymo suvestinė</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-graphite-black/60">Modelis:</span>
              <span className="font-medium">{formData.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite-black/60">Data:</span>
              <span className="font-medium">
                {formData.startDate ? new Date(formData.startDate).toLocaleDateString('lt-LT') : 'Nepasirinkta'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite-black/60">Trukmė:</span>
              <span className="font-medium">
                {formData.rentalType === 'full' ? 'Visa diena (9:00-18:00)' : 
                 formData.rentalType === 'morning' ? 'Pirmoji pusė (9:00-13:00)' : 
                 'Antroji pusė (13:00-18:00)'}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-sage-green/20 text-lg font-bold">
              <span>Iš viso mokėti:</span>
              <span className="text-sage-green">€{rentalPrice + 500}</span>
            </div>
            <p className="text-xs text-graphite-black/60 mt-2">
              *Įskaitant €500 užstatą
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="flex justify-between mt-8">
      <button 
        type="button" 
        onClick={prevStep}
        className="px-6 py-3 border border-sage-green text-sage-green rounded-lg font-medium hover:bg-sage-green/5 transition-colors"
      >
        Atgal
      </button>
      
      <button 
        type="submit" 
        className="btn-primary px-6 py-3"
        disabled={loading || !Object.values(formData.documentsAccepted).every(Boolean)}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Pateikiama...</span>
          </>
        ) : (
          <span>Pateikti užsakymą</span>
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
                <h4 className="font-syne font-bold mb-2">Darbo laikas</h4>
                <p className="text-sm text-graphite-black/70">
                  Kasdien 9:00 - 18:00. Vespa paėmimas ir grąžinimas pagal susitarimą.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-full bg-sage-green/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-syne font-bold mb-2">Mokėjimas</h4>
                <p className="text-sm text-graphite-black/70">
                  Priimame korteles ir grynuosius pinigus. Užstatas grąžinamas po nuomos.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-full bg-sage-green/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-syne font-bold mb-2">Reikalavimai</h4>
                <p className="text-sm text-graphite-black/70">
                  Būtinas vairuotojo pažymėjimas ir 21+ metų amžius. Šalmas įskaičiuotas.
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
                Pagalba ar klausimai? <a href="tel:+37067956380" className="text-sage-green hover:underline">+370 679 56380</a>
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}