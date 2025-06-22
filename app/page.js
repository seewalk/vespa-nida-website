// app/page.js
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../components/context/LanguageContext';
import HeroSection from '../components/HeroSection';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AboutSection from '../components/AboutSection';
import FleetSection from '../components/FleetSection';
import ExploreSection from '../components/ExploreSection';
import BookingForm from '../components/BookingForm';
import FAQSection from '../components/FAQSection';
import SEO from '../components/SEO';

// Inline FAQ Component
function InlineFAQPreview() {
  const { t } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const quickFAQs = [
    { q: t('faq.questions.q1'), a: t('faq.answers.a1') },
    { q: t('faq.questions.q6'), a: t('faq.answers.a6') },
    { q: t('faq.questions.q4'), a: t('faq.answers.a4') }
  ];

  return (
    
    <section className="py-12 bg-ivory-white/50" itemScope itemType="https://schema.org/FAQPage">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold font-syne text-center mb-8">
          Quick Questions & Answers
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {quickFAQs.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-sm"
              itemScope
              itemType="https://schema.org/Question"
              itemProp="mainEntity"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full p-4 text-left hover:bg-sage-green/5 rounded-lg transition-colors"
              >
                <h3 className="font-medium" itemProp="name">{item.q}</h3>
              </button>
              
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                    itemScope
                    itemType="https://schema.org/Answer"
                    itemProp="acceptedAnswer"
                  >
                    <p className="text-graphite-black/70 text-sm" itemProp="text">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <a 
            href="#faq"
            className="text-sage-green hover:text-sage-green/80 font-medium"
          >
            View All Questions →
          </a>
        </div>
      </div>

      {/* Rich snippets structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": quickFAQs.map(item => ({
              "@type": "Question",
              "name": item.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
              }
            }))
          })
        }}
      />
    </section>
  );
}

export default function Home() {
  return (
    
    <main>
      <SEO 
                title="Vespa Nida | Prabangūs Vespa motoroleriai nuomai Nidoje, Lietuvoje"
                description="Patirkite Nidos grožį su mūsų prabangių Vespa motorolerių nuomos paslaugomis. Tyrinėkite kuršių nerijos pakrantę stilingai su Vespa Nida."
                keywords="motoroleriu nuoma, nuoma nida, masinos nuoma, dviracio nuoma nida, motoroleriu nuoma klaipeda, nida nuoma, vespa rental nida, explore nida, travel nida, travel to nida, nida scooter rental, nida vespa rental, nida electric scooter, nida vespa tours"
                ogImage="/images/hero-vespa-nida.jpg"
                section="home"
              />
      <Header />
      <HeroSection />
      <BookingForm />
      <AboutSection />
      <InlineFAQPreview />
      <FleetSection />
      <ExploreSection />
      <FAQSection />
      <BookingForm />
      <Footer />
    </main>
  );
}