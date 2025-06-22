'use client';

import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Adjust path as needed
import { motion, AnimatePresence } from 'framer-motion';

function EditBookingModal({ booking, onClose, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Customer data
    customerName: booking.customer?.name || '',
    customerEmail: booking.customer?.email || '',
    customerPhone: booking.customer?.phone || '',
    customerAge: booking.customer?.age || '',
    drivingLicense: booking.customer?.drivingLicense || '',
    
    // Booking data
    vespaModel: booking.booking?.vespaModel || '',
    startDate: booking.booking?.startDate || '',
    rentalType: booking.booking?.rentalType || 'full',
    additionalHelmet: booking.booking?.additionalHelmet || false,
    route: booking.booking?.route || '',
    message: booking.booking?.message || '',
    
    // Pricing data
    basePrice: booking.pricing?.basePrice || 0,
    helmetPrice: booking.pricing?.helmetPrice || 0,
    securityDeposit: booking.pricing?.securityDeposit || 0
  });

  const [errors, setErrors] = useState({});

  // Calculate totals (same logic as your pricing)
  const subtotal = parseFloat(formData.basePrice) + (formData.additionalHelmet ? parseFloat(formData.helmetPrice) : 0);
  const totalAmount = subtotal + parseFloat(formData.securityDeposit);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Customer validation
    if (!formData.customerName.trim()) newErrors.customerName = 'Vardas privalomas';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'El. paštas privalomas';
    if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) newErrors.customerEmail = 'Neteisingas el. pašto formatas';
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Telefonas privalomas';
    if (!formData.customerAge || formData.customerAge < 18) newErrors.customerAge = 'Amžius turi būti bent 18 metų';

    // Booking validation
    if (!formData.vespaModel.trim()) newErrors.vespaModel = 'Vespa modelis privalomas';
    if (!formData.startDate) newErrors.startDate = 'Data privaloma';

    // Pricing validation
    if (!formData.basePrice || formData.basePrice <= 0) newErrors.basePrice = 'Bazinė kaina turi būti teigiama';
    if (formData.additionalHelmet && (!formData.helmetPrice || formData.helmetPrice < 0)) {
      newErrors.helmetPrice = 'Šalmo kaina turi būti teigiama';
    }
    if (!formData.securityDeposit || formData.securityDeposit < 0) {
      newErrors.securityDeposit = 'Užstatas turi būti teigiamas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const bookingRef = doc(db, 'bookings', booking.id);
      
      const updatedData = {
        customer: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
          age: parseInt(formData.customerAge),
          drivingLicense: formData.drivingLicense
        },
        booking: {
          vespaModel: formData.vespaModel,
          startDate: formData.startDate,
          rentalType: formData.rentalType,
          additionalHelmet: formData.additionalHelmet,
          route: formData.route,
          message: formData.message
        },
        pricing: {
          basePrice: parseFloat(formData.basePrice),
          helmetPrice: parseFloat(formData.helmetPrice),
          subtotal: subtotal,
          securityDeposit: parseFloat(formData.securityDeposit),
          totalAmount: totalAmount
        },
        'metadata.updatedAt': new Date()
      };

      await updateDoc(bookingRef, updatedData);

      // Trigger webhook for external integrations
      const webhookPayload = {
        event: 'booking_details_updated',
        bookingId: booking.id,
        bookingReference: booking.bookingReference,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        startDate: formData.startDate,
        vespaModel: formData.vespaModel,
        rentalType: formData.rentalType,
        totalAmount: totalAmount,
        timestamp: new Date().toISOString()
      };

      try {
        await fetch('https://seewalk.app.n8n.cloud/webhook-test/booking-automation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        });
        console.log('✅ Webhook triggered for booking update');
      } catch (webhookError) {
        console.error('❌ Error triggering webhook:', webhookError);
      }

      // Call onUpdate with updated booking data
      onUpdate({
        ...booking,
        ...updatedData
      });

    } catch (error) {
      console.error('Error updating booking:', error);
      setErrors({ submit: 'Klaida atnaujinant užsakymą. Bandykite dar kartą.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Format price
  const formatPrice = (price) => {
    return `€${price || 0}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-sage-green text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">
              Redaguoti užsakymo detales - #{booking.bookingReference}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-6 space-y-6">
              
              {/* Error message */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {errors.submit}
                </div>
              )}

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-graphite-black mb-4 flex items-center">
                  <span className="text-lg mr-2">👤</span>
                  Kliento informacija
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-graphite-black mb-1">
                      Vardas *
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green ${
                        errors.customerName ? 'border-red-500' : 'border-sand-beige'
                      }`}
                    />
                    {errors.customerName && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-graphite-black mb-1">
                      El. paštas *
                    </label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green ${
                        errors.customerEmail ? 'border-red-500' : 'border-sand-beige'
                      }`}
                    />
                    {errors.customerEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-graphite-black mb-1">
                      Telefonas *
                    </label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green ${
                        errors.customerPhone ? 'border-red-500' : 'border-sand-beige'
                      }`}
                    />
                    {errors.customerPhone && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-graphite-black mb-1">
                      Amžius *
                    </label>
                    <input
                      type="number"
                      min="18"
                      value={formData.customerAge}
                      onChange={(e) => handleInputChange('customerAge', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green ${
                        errors.customerAge ? 'border-red-500' : 'border-sand-beige'
                      }`}
                    />
                    {errors.customerAge && (
                      <p className="text-red-500 text-xs mt-1">{errors.customerAge}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-graphite-black mb-1">
                      Vairuotojo pažymėjimas
                    </label>
                    <select
                      value={formData.drivingLicense}
                      onChange={(e) => handleInputChange('drivingLicense', e.target.value)}
                      className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
                    >
                      <option value="Taip">Taip</option>
                      <option value="Ne">Ne</option>
                      <option value="Tarptautinis">Tarptautinis</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-graphite-black mb-4 flex items-center">
                  <span className="text-lg mr-2">🛵</span>
                  Rezervacijos detalės
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-graphite-black mb-1">
                      Vespa modelis *
                    </label>
                    <select
                      value={formData.vespaModel}
                      onChange={(e) => handleInputChange('vespaModel', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green ${
                        errors.vespaModel ? 'border-red-500' : 'border-sand-beige'
                      }`}
                    >
                      <option value="">Pasirinkite modelį</option>
                      <option value="Vespa Elettrica 45">Vespa Elettrica 45</option>
                      <option value="Vespa Elettrica 70">Vespa Elettrica 70</option>
                      <option value="Vespa GTS 300">Vespa GTS 300</option>
                    </select>
                    {errors.vespaModel && (
                      <p className="text-red-500 text-xs mt-1">{errors.vespaModel}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-graphite-black mb-1">
                      Data *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green ${
                        errors.startDate ? 'border-red-500' : 'border-sand-beige'
                      }`}
                    />
                    {errors.startDate && (
                      <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-graphite-black mb-1">
                      Nuomos tipas
                    </label>
                    <select
                      value={formData.rentalType}
                      onChange={(e) => handleInputChange('rentalType', e.target.value)}
                      className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
                    >
                      <option value="full">Pilna diena</option>
                      <option value="morning">Rytas (9:00-15:30)</option>
                      <option value="evening">Vakaras (16:30-23:00)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-graphite-black mb-1">
                      Papildomas šalmas
                    </label>
                    <div className="flex items-center space-x-4 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="additionalHelmet"
                          checked={formData.additionalHelmet === true}
                          onChange={() => handleInputChange('additionalHelmet', true)}
                          className="mr-2"
                        />
                        Taip
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="additionalHelmet"
                          checked={formData.additionalHelmet === false}
                          onChange={() => handleInputChange('additionalHelmet', false)}
                          className="mr-2"
                        />
                        Ne
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-graphite-black mb-1">
                      Maršrutas
                    </label>
                    <input
                      type="text"
                      value={formData.route}
                      onChange={(e) => handleInputChange('route', e.target.value)}
                      className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
                      placeholder="Pvz. Nida - Juodkrantė - Preila"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-graphite-black mb-1">
                      Žinutė
                    </label>
                    <textarea
                      rows="3"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full px-3 py-2 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
                      placeholder="Papildoma informacija ar pageidavimai..."
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-graphite-black mb-4 flex items-center">
                  <span className="text-lg mr-2">💰</span>
                  Kainodara
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-graphite-black mb-1">
                      Bazinė kaina (€) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.basePrice}
                      onChange={(e) => handleInputChange('basePrice', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green ${
                        errors.basePrice ? 'border-red-500' : 'border-sand-beige'
                      }`}
                    />
                    {errors.basePrice && (
                      <p className="text-red-500 text-xs mt-1">{errors.basePrice}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-graphite-black mb-1">
                      Šalmo kaina (€)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.helmetPrice}
                      onChange={(e) => handleInputChange('helmetPrice', e.target.value)}
                      disabled={!formData.additionalHelmet}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green ${
                        !formData.additionalHelmet ? 'bg-gray-100' : ''
                      } ${errors.helmetPrice ? 'border-red-500' : 'border-sand-beige'}`}
                    />
                    {errors.helmetPrice && (
                      <p className="text-red-500 text-xs mt-1">{errors.helmetPrice}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-graphite-black mb-1">
                      Užstatas (€) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.securityDeposit}
                      onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green ${
                        errors.securityDeposit ? 'border-red-500' : 'border-sand-beige'
                      }`}
                    />
                    {errors.securityDeposit && (
                      <p className="text-red-500 text-xs mt-1">{errors.securityDeposit}</p>
                    )}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="mt-4 pt-4 border-t border-sand-beige">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-graphite-black/60">Tarpinė suma:</span>
                      <span className="font-medium">{formatPrice(subtotal.toFixed(2))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-graphite-black/60">Užstatas:</span>
                      <span className="font-medium">{formatPrice(formData.securityDeposit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-graphite-black font-medium">Iš viso:</span>
                      <span className="font-bold text-sage-green text-lg">{formatPrice(totalAmount.toFixed(2))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-graphite-black bg-white border border-sand-beige rounded-lg hover:bg-gray-50 transition-colors"
              >
                Atšaukti
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-sage-green text-white rounded-lg hover:bg-sage-green/90 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Išsaugoma...' : 'Išsaugoti pakeitimus'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Make sure to use default export
export default EditBookingModal;