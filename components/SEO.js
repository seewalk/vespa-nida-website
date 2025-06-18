// src/components/SEO.js
'use client';

import Head from 'next/head';
import { useLanguage } from './context/LanguageContext';
import { useEffect } from 'react';

export default function SEO({ 
  title, 
  description, 
  canonical,
  ogImage = '/images/og-image.jpg',
  keywords,
  noIndex = false,
  section = 'home' // Add section identifier
}) {
  const { currentLanguage, availableLanguages } = useLanguage();

  // Build full title with site name
  const fullTitle = title ? `${title} | Vespa Nida` : 'Vespa Nida - Premium Vespa Rental in Nida';

  const getCanonicalUrl = () => {
    if (canonical) return canonical;
    
    const baseUrls = {
      'lt': 'https://vespanida.lt',
      'en': 'https://en.vespanida.lt', 
      'de': 'https://de.vespanida.lt',
      'pl': 'https://pl.vespanida.lt'
    };
    
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const sectionHash = section !== 'home' ? `#${section}` : '';
    return `${baseUrls[currentLanguage] || 'https://vespanida.lt'}${currentPath}${sectionHash}`;
  };

  const getOgImageUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://vespanida.lt';
    return ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;
  };

  // Update document title dynamically (for sections)
  useEffect(() => {
    if (section !== 'home' && title) {
      document.title = fullTitle;
    }
  }, [fullTitle, section, title]);

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={getCanonicalUrl()} />
      
      {/* No Index (for dev/staging) */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Language alternates for SEO */}
      {availableLanguages?.map(lang => (
        <link
          key={lang.code}
          rel="alternate"
          hrefLang={lang.code}
          href={`https://${lang.domain}${typeof window !== 'undefined' ? window.location.pathname : ''}${section !== 'home' ? `#${section}` : ''}`}
        />
      ))}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={getOgImageUrl()} />
      <meta property="og:url" content={getCanonicalUrl()} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Vespa Nida" />
      <meta property="og:locale" content={currentLanguage === 'lt' ? 'lt_LT' : `${currentLanguage}_${currentLanguage.toUpperCase()}`} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={getOgImageUrl()} />
      
      {/* Section-specific structured data */}
      {section === 'fleet' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RentalCarAgency",
              "name": "Vespa Nida",
              "description": description,
              "url": getCanonicalUrl(),
              "vehicleType": "Scooter"
            })
          }}
        />
      )}
    </Head>
  );
}
