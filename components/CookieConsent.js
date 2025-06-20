'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './context/LanguageContext';

export default function CookieConsent() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check consent status
    const consent = localStorage.getItem('vespa-nida-cookie-consent');
    const consentVersion = localStorage.getItem('vespa-nida-consent-version');
    const currentVersion = '1.0';
    
    if (!consent || consentVersion !== currentVersion) {
      // Show popup for new visitors or when policy updated
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // Apply existing consent
      const parsedConsent = JSON.parse(consent);
      applyConsent(parsedConsent);
    }
  }, []);

  const applyConsent = (consent) => {
    // Initialize services based on consent
    if (consent.analytics) {
      initializeGoogleAnalytics();
    }
    if (consent.marketing) {
      initializeMarketingTools();
    }
    if (consent.preferences) {
      initializePreferences();
    }
    
    // Always initialize necessary cookies
    initializeNecessaryCookies();
  };

  

  const handleAcceptAll = () => {
    const consent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      consentMethod: 'explicit_accept_all'
    };
    
    saveConsent(consent);
    applyConsent(consent);
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    const consent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      consentMethod: 'explicit_necessary_only'
    };
    
    saveConsent(consent);
    applyConsent(consent);
    setIsVisible(false);
  };
  

  const handleCustomize = () => {
    setShowDetails(!showDetails);
  };

  const handleSavePreferences = () => {
    const analytics = document.getElementById('analytics-cookies')?.checked || false;
    const marketing = document.getElementById('marketing-cookies')?.checked || false;
    const preferences = document.getElementById('preferences-cookies')?.checked || false;

    const consent = {
      necessary: true,
      analytics,
      marketing,
      preferences,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      consentMethod: 'explicit_custom'
    };

    saveConsent(consent);
    applyConsent(consent);
    setIsVisible(false);
  };

  const saveConsent = (consent) => {
    localStorage.setItem('vespa-nida-cookie-consent', JSON.stringify(consent));
    localStorage.setItem('vespa-nida-consent-version', '1.0');
    
    // Send consent record to your backend for audit trail (optional)
    sendConsentToBackend(consent);
  };

  const sendConsentToBackend = async (consent) => {
  console.log('🚀 Sending consent to backend:', consent);
  console.log('🌍 Current URL:', window.location.href);
  
  try {
    const response = await fetch('/api/consent-record', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...consent,
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof window !== 'undefined' ? document.referrer : ''
      })
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response ok:', response.ok);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Get response text (works for both success and error)
    const responseText = await response.text();
    console.log('📄 Raw response:', responseText);
    
    if (!response.ok) {
      console.error('❌ API Error Details:');
      console.error('  Status:', response.status);
      console.error('  Status Text:', response.statusText);
      console.error('  Response:', responseText);
      
      // Try to parse as JSON if possible
      try {
        const errorData = JSON.parse(responseText);
        console.error('  Parsed error:', errorData);
      } catch (e) {
        console.error('  Raw error text:', responseText);
      }
      
      return; // Don't throw, just return so popup still closes
    }
    
    // Parse successful response
    const result = JSON.parse(responseText);
    console.log('✅ Success response:', result);
    
  } catch (error) {
    console.error('❌ Network/Request Error:');
    console.error('  Error name:', error.name);
    console.error('  Error message:', error.message);
    console.error('  Error stack:', error.stack);
    
    // Don't throw - let the popup close normally
  }
};

  const initializeGoogleAnalytics = () => {
    if (typeof window !== 'undefined' && !window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
      // Initialize GA only after consent
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
      document.head.appendChild(script);
      
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        anonymize_ip: true,
        storage: 'denied',
      });
      gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const initializeMarketingTools = () => {
    if (typeof window !== 'undefined' && !window.fbq && process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID) {
      // Facebook Pixel initialization
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      
      window.fbq('init', process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
      window.fbq('track', 'PageView');
    }
  };

  const initializePreferences = () => {
    console.log('Preferences cookies enabled');
  };

  const initializeNecessaryCookies = () => {
    console.log('Necessary cookies initialized');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-sand-beige shadow-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4">
            {/* Main content */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
              <div className="flex-1 pr-0 lg:pr-8">
                <h3 className="font-bold text-graphite-black mb-2 font-syne">
                  {t('cookies.title', 'Slapukai (Cookies)')}
                </h3>
                <p className="text-sm text-graphite-black/70 mb-3">
                  {t('cookies.description', 'Mes naudojame slapukus, kad pagerintume jūsų naršymo patirtį, analizuotaume srautą ir suteiktume personalizuotą turinį.')}
                </p>
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => window.open('/slapukai', '_blank')}
                    className="text-sage-green hover:underline"
                  >
                    {t('cookies.readPolicy', 'Skaityti slapukų politiką')}
                  </button>
                  <span className="text-graphite-black/40">|</span>
                  <button
                    onClick={() => window.open('/privatumo-politika', '_blank')}
                    className="text-sage-green hover:underline"
                  >
                    {t('cookies.readPrivacy', 'Privatumo politika')}
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleAcceptNecessary}
                  className="px-4 py-2 border border-sage-green text-sage-green rounded-lg hover:bg-sage-green/5 transition-colors text-sm font-medium"
                >
                  {t('cookies.acceptNecessary', 'Tik būtini')}
                </button>
                <button
                  onClick={handleCustomize}
                  className="px-4 py-2 border border-graphite-black/20 text-graphite-black rounded-lg hover:bg-graphite-black/5 transition-colors text-sm font-medium"
                >
                  {t('cookies.customize', 'Tikrinti')}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-sage-green text-white rounded-lg hover:bg-sage-green/90 transition-colors text-sm font-medium"
                >
                  {t('cookies.acceptAll', 'Priimti visus')}
                </button>
              </div>
            </div>

            {/* Detailed settings */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-sand-beige pt-4 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Necessary Cookies */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="necessary-cookies"
                        checked={true}
                        disabled={true}
                        className="mt-1 text-sage-green"
                      />
                      <div className="flex-1">
                        <label htmlFor="necessary-cookies" className="font-medium text-sm text-graphite-black">
                          {t('cookies.necessary.title', 'Būtini slapukai')}
                        </label>
                        <p className="text-xs text-graphite-black/60 mt-1">
                          {t('cookies.necessary.description', 'Šie slapukai yra būtini svetainės veikimui ir negali būti išjungti.')}
                        </p>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="analytics-cookies"
                        defaultChecked={true}
                        className="mt-1 text-sage-green"
                      />
                      <div className="flex-1">
                        <label htmlFor="analytics-cookies" className="font-medium text-sm text-graphite-black">
                          {t('cookies.analytics.title', 'Analitikos slapukai')}
                        </label>
                        <p className="text-xs text-graphite-black/60 mt-1">
                          {t('cookies.analytics.description', 'Padeda mums suprasti, kaip lankytojai naudoja svetainę.')}
                        </p>
                      </div>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="marketing-cookies"
                        defaultChecked={false}
                        className="mt-1 text-sage-green"
                      />
                      <div className="flex-1">
                        <label htmlFor="marketing-cookies" className="font-medium text-sm text-graphite-black">
                          {t('cookies.marketing.title', 'Rinkodaros slapukai')}
                        </label>
                        <p className="text-xs text-graphite-black/60 mt-1">
                          {t('cookies.marketing.description', 'Naudojami personalizuotos reklamos rodymui.')}
                        </p>
                      </div>
                    </div>

                    {/* Preferences Cookies */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="preferences-cookies"
                        defaultChecked={true}
                        className="mt-1 text-sage-green"
                      />
                      <div className="flex-1">
                        <label htmlFor="preferences-cookies" className="font-medium text-sm text-graphite-black">
                          {t('cookies.preferences.title', 'Nustatymų slapukai')}
                        </label>
                        <p className="text-xs text-graphite-black/60 mt-1">
                          {t('cookies.preferences.description', 'Išsaugo jūsų pasirinkimus, pvz., kalbą.')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 space-x-3">
                    <button
                      onClick={handleCustomize}
                      className="px-4 py-2 text-sm text-graphite-black/60 hover:text-graphite-black"
                    >
                      {t('cookies.cancel', 'Atšaukti')}
                    </button>
                    <button
                      onClick={handleSavePreferences}
                      className="px-4 py-2 bg-sage-green text-white rounded-lg hover:bg-sage-green/90 transition-colors text-sm font-medium"
                    >
                      {t('cookies.savePreferences', 'Išsaugoti nustatymus')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}