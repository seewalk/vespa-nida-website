// components/booking/VespaPreview.js
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '../context/LanguageContext';

export default function VespaPreview() {
  const { t } = useLanguage();
  
  // Define vespaModels directly in the component (same as in BookingFormSteps)
  const vespaModels = [
    {
      id: 'primavera',
      name: t('booking.models.primavera.name'),
      color: t('booking.models.primavera.color'),
      cc: t('booking.models.primavera.cc'),
      topSpeed: t('booking.models.primavera.topSpeed'),
      range: t('booking.models.primavera.range'),
      idealFor: t('booking.models.primavera.idealFor'),
      image: '/images/fleet-white-vespa.jpg',
      price: 79,
      comingSoon: false
    },
    {
      id: 'gts',
      name: t('booking.models.gts.name'),
      color: t('booking.models.gts.color'),
      cc: t('booking.models.gts.cc'),
      topSpeed: t('booking.models.gts.topSpeed'),
      range: t('booking.models.gts.range'),
      idealFor: t('booking.models.gts.idealFor'),
      image: '/images/fleet-green-vespa.jpg',
      price: 99,
      comingSoon: true
    },
    {
      id: 'sprint',
      name: t('booking.models.sprint.name'),
      color: t('booking.models.sprint.color'),
      cc: t('booking.models.sprint.cc'),
      topSpeed: t('booking.models.sprint.topSpeed'),
      range: t('booking.models.sprint.range'),
      idealFor: t('booking.models.sprint.idealFor'),
      image: '/images/fleet-beige-vespa.jpg',
      price: 69,
      comingSoon: false
    }
  ];

  const featuredVespa = vespaModels[0]; // Show Primavera as featured

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-xs mb-6"
    >
      <div className="aspect-square overflow-hidden rounded-xl shadow-md relative">
        <Image
          src={featuredVespa.image}
          alt={featuredVespa.name}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white font-bold font-syne text-lg mb-1">
            {featuredVespa.name}
          </h3>
          <div className="flex justify-between items-center text-white mb-2">
            <p className="opacity-80 text-sm">{featuredVespa.color}</p>
            <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded">
              €{featuredVespa.price}/day
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-white/80">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{featuredVespa.cc}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>{featuredVespa.range}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}