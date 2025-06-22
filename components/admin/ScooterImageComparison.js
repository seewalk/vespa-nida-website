'use client';

import { useState, useRef } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGE_CATEGORIES = [
  { id: 'front', label: 'Priekis', icon: '🔵' },
  { id: 'back', label: 'Galas', icon: '🔴' },
  { id: 'left', label: 'Kairė', icon: '🟡' },
  { id: 'right', label: 'Dešinė', icon: '🟢' },
  { id: 'dashboard', label: 'Skydelis', icon: '📊' },
  { id: 'seat', label: 'Sėdynė', icon: '🪑' },
  { id: 'damage', label: 'Pažeidimai', icon: '⚠️' },
  { id: 'general', label: 'Bendras', icon: '📷' }
];

function ScooterImageComparison({ booking, onClose, onUpdate }) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showDamageForm, setShowDamageForm] = useState(false);
  const [damageDescription, setDamageDescription] = useState('');
  const [submittingDamage, setSubmittingDamage] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [imageZoom, setImageZoom] = useState({ before: false, after: false });

  // Debug: Log the booking structure
  console.log('🔍 ScooterImageComparison - Booking structure:', {
    bookingId: booking.id,
    beforeImages: booking.images?.before?.images?.length || 0,
    afterImages: booking.images?.after?.images?.length || 0,
    damageReports: booking.damageReports?.length || 0,
    inspectionReports: booking.inspectionReports?.length || 0,
    fullBooking: booking
  });

  // Get images that have both before and after
  const beforeImages = booking.images?.before?.images || [];
  const afterImages = booking.images?.after?.images || [];

  console.log('📸 Image analysis:', {
    beforeImages: beforeImages.map(img => ({ id: img.id, category: img.category })),
    afterImages: afterImages.map(img => ({ id: img.id, category: img.category }))
  });

  // Create comparison pairs - only show categories that have both before and after images
  const comparisonPairs = IMAGE_CATEGORIES.map(category => {
    const beforeImage = beforeImages.find(img => img.category === category.id);
    const afterImage = afterImages.find(img => img.category === category.id);
    
    return {
      category,
      beforeImage,
      afterImage,
      hasBoth: beforeImage && afterImage
    };
  }).filter(pair => pair.hasBoth);

  console.log('🔄 Comparison pairs:', comparisonPairs.map(pair => ({
    category: pair.category.id,
    hasBoth: pair.hasBoth,
    beforeId: pair.beforeImage?.id,
    afterId: pair.afterImage?.id
  })));

  // If no valid pairs, return early
  if (comparisonPairs.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-ivory-white rounded-xl p-6 max-w-md">
          <h3 className="text-xl font-bold mb-4">Nėra nuotraukų palyginimui</h3>
          <p className="text-graphite-black/70 mb-4">
            Norint palyginti nuotraukas, reikia turėti ir "prieš", ir "po" nuotraukas toje pačioje kategorijoje.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-sage-green text-white rounded-lg"
          >
            Uždaryti
          </button>
        </div>
      </div>
    );
  }

  const currentPair = comparisonPairs[currentCategoryIndex];

  // Add notification
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Navigate between categories
  const goToPrevious = () => {
    setCurrentCategoryIndex(prev => 
      prev === 0 ? comparisonPairs.length - 1 : prev - 1
    );
    setShowDamageForm(false);
  };

  const goToNext = () => {
    setCurrentCategoryIndex(prev => 
      prev === comparisonPairs.length - 1 ? 0 : prev + 1
    );
    setShowDamageForm(false);
  };

  // Helper function to safely format timestamps
  const formatTimestamp = (timestamp) => {
    try {
      if (!timestamp) return 'N/A';
      
      // Handle Firebase Timestamp objects
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString('lt-LT');
      }
      
      // Handle JavaScript Date objects
      if (timestamp instanceof Date) {
        return timestamp.toLocaleString('lt-LT');
      }
      
      // Handle timestamp strings
      if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleString('lt-LT');
      }
      
      // Handle unix timestamp numbers
      if (typeof timestamp === 'number') {
        return new Date(timestamp).toLocaleString('lt-LT');
      }
      
      return 'N/A';
    } catch (error) {
      console.error('Error formatting timestamp:', error, timestamp);
      return 'N/A';
    }
  };

  // Log damage to Firebase
  const logDamage = async () => {
    if (!damageDescription.trim()) {
      addNotification('Įveskite pažeidimo aprašymą', 'error');
      return;
    }

    setSubmittingDamage(true);
    try {
      const bookingRef = doc(db, 'bookings', booking.id);
      
      const damageLog = {
        id: `damage_${Date.now()}`,
        category: currentPair.category.id,
        categoryLabel: currentPair.category.label,
        description: damageDescription.trim(),
        beforeImageId: currentPair.beforeImage.id,
        afterImageId: currentPair.afterImage.id,
        beforeImageUrl: currentPair.beforeImage.downloadURL,
        afterImageUrl: currentPair.afterImage.downloadURL,
        reportedAt: new Date(),
        reportedBy: auth.currentUser?.email || 'unknown',
        status: 'reported'
      };

      console.log('💾 Logging damage:', damageLog);

      const updateData = {
        'damageReports': arrayUnion(damageLog),
        'metadata.updatedAt': new Date(),
        'metadata.lastDamageReport': new Date()
      };

      await updateDoc(bookingRef, updateData);

      // Update parent component
      if (onUpdate) {
        onUpdate({
          ...booking,
          damageReports: [...(booking.damageReports || []), damageLog]
        });
      }

      addNotification(`Pažeidimas užregistruotas: ${currentPair.category.label}`, 'success');
      setDamageDescription('');
      setShowDamageForm(false);

      console.log('✅ Damage logged successfully:', damageLog);

    } catch (error) {
      console.error('❌ Error logging damage:', error);
      addNotification('Klaida registruojant pažeidimą', 'error');
    } finally {
      setSubmittingDamage(false);
    }
  };

  // Mark category as OK (no damage)
  const markAsOK = async () => {
    try {
      const bookingRef = doc(db, 'bookings', booking.id);
      
      const okLog = {
        id: `ok_${Date.now()}`,
        category: currentPair.category.id,
        categoryLabel: currentPair.category.label,
        status: 'ok',
        checkedAt: new Date(),
        checkedBy: auth.currentUser?.email || 'unknown'
      };

      console.log('✅ Marking as OK:', okLog);

      const updateData = {
        'inspectionReports': arrayUnion(okLog),
        'metadata.updatedAt': new Date()
      };

      await updateDoc(bookingRef, updateData);

      if (onUpdate) {
        onUpdate({
          ...booking,
          inspectionReports: [...(booking.inspectionReports || []), okLog]
        });
      }

      addNotification(`✅ ${currentPair.category.label} - viskas tvarkoj`, 'success');
      
      // Auto-advance to next category
      setTimeout(() => {
        if (currentCategoryIndex < comparisonPairs.length - 1) {
          goToNext();
        }
      }, 1000);

    } catch (error) {
      console.error('❌ Error marking as OK:', error);
      addNotification('Klaida išsaugant patikrinimą', 'error');
    }
  };

  // Check if current category has been inspected
  const getCurrentInspectionStatus = () => {
    const damageReports = booking.damageReports || [];
    const inspectionReports = booking.inspectionReports || [];
    
    console.log('🔍 Checking inspection status for category:', currentPair.category.id, {
      damageReports: damageReports.map(r => ({ category: r.category, status: r.status })),
      inspectionReports: inspectionReports.map(r => ({ category: r.category, status: r.status }))
    });
    
    const hasDamage = damageReports.some(report => 
      report.category === currentPair.category.id
    );
    
    const isOK = inspectionReports.some(report => 
      report.category === currentPair.category.id && report.status === 'ok'
    );

    console.log('📊 Inspection status result:', {
      category: currentPair.category.id,
      hasDamage,
      isOK,
      finalStatus: hasDamage ? 'damage' : isOK ? 'ok' : 'unchecked'
    });

    if (hasDamage) return 'damage';
    if (isOK) return 'ok';
    return 'unchecked';
  };

  const inspectionStatus = getCurrentInspectionStatus();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-ivory-white rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Notifications */}
          <div className="fixed top-4 right-4 z-60 space-y-2">
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  className={`px-4 py-3 rounded-lg shadow-lg ${
                    notification.type === 'error' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-sage-green text-white'
                  }`}
                >
                  {notification.message}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Header */}
          <div className="bg-sage-green text-white p-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold font-syne">
                🔍 Nuotraukų palyginimas - #{booking.bookingReference}
              </h2>
              <p className="text-sm opacity-80">
                {currentPair.category.icon} {currentPair.category.label} 
                ({currentCategoryIndex + 1}/{comparisonPairs.length})
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-sand-beige text-2xl transition-colors"
            >
              ×
            </button>
          </div>

          {/* Category Navigation */}
          <div className="bg-white border-b border-sand-beige p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPrevious}
                className="flex items-center px-4 py-2 bg-graphite-black/10 rounded-lg hover:bg-graphite-black/20 transition-colors"
              >
                ← Ankstesnis
              </button>
              
              <div className="flex space-x-2">
                {comparisonPairs.map((pair, index) => {
                  const status = booking.damageReports?.some(r => r.category === pair.category.id) ? 'damage' :
                               booking.inspectionReports?.some(r => r.category === pair.category.id && r.status === 'ok') ? 'ok' : 'unchecked';
                  
                  return (
                    <button
                      key={pair.category.id}
                      onClick={() => setCurrentCategoryIndex(index)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        index === currentCategoryIndex
                          ? 'border-sage-green bg-sage-green text-white shadow-md'
                          : status === 'damage'
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : status === 'ok'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-sand-beige hover:border-sage-green bg-white'
                      }`}
                    >
                      <div className="text-lg">{pair.category.icon}</div>
                      <div className="text-xs font-medium">{pair.category.label}</div>
                      {status === 'damage' && <div className="text-xs">⚠️</div>}
                      {status === 'ok' && <div className="text-xs">✅</div>}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={goToNext}
                className="flex items-center px-4 py-2 bg-graphite-black/10 rounded-lg hover:bg-graphite-black/20 transition-colors"
              >
                Kitas →
              </button>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">
              {inspectionStatus === 'damage' && (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium border border-red-200">
                  ⚠️ Užregistruoti pažeidimai
                </span>
              )}
              {inspectionStatus === 'ok' && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                  ✅ Patikrinta - viskas tvarkoj
                </span>
              )}
              {inspectionStatus === 'unchecked' && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
                  ⏳ Laukia patikrinimo
                </span>
              )}
            </div>
          </div>

          {/* Image Comparison */}
          <div className="p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Before Image */}
              <div className="bg-white rounded-xl border border-sand-beige overflow-hidden">
                <div className="bg-blue-50 p-3 border-b border-sand-beige">
                  <h3 className="font-bold text-graphite-black flex items-center">
                    <span className="text-lg mr-2">📸</span>
                    Prieš nuomą
                  </h3>
                  <p className="text-xs text-graphite-black/60 mt-1">
                    {formatTimestamp(currentPair.beforeImage.uploadedAt)}
                  </p>
                </div>
                <div className="relative">
                  <img
                    src={currentPair.beforeImage.downloadURL}
                    alt={`Prieš - ${currentPair.category.label}`}
                    className={`w-full h-80 object-cover cursor-zoom-in transition-transform ${
                      imageZoom.before ? 'scale-150' : 'scale-100'
                    }`}
                    onClick={() => setImageZoom(prev => ({ ...prev, before: !prev.before }))}
                  />
                  {imageZoom.before && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="bg-white/90 px-2 py-1 rounded text-xs">
                        Spustelėkite sumažinti
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* After Image */}
              <div className="bg-white rounded-xl border border-sand-beige overflow-hidden">
                <div className="bg-orange-50 p-3 border-b border-sand-beige">
                  <h3 className="font-bold text-graphite-black flex items-center">
                    <span className="text-lg mr-2">📸</span>
                    Po nuomos
                  </h3>
                  <p className="text-xs text-graphite-black/60 mt-1">
                    {formatTimestamp(currentPair.afterImage.uploadedAt)}
                  </p>
                </div>
                <div className="relative">
                  <img
                    src={currentPair.afterImage.downloadURL}
                    alt={`Po - ${currentPair.category.label}`}
                    className={`w-full h-80 object-cover cursor-zoom-in transition-transform ${
                      imageZoom.after ? 'scale-150' : 'scale-100'
                    }`}
                    onClick={() => setImageZoom(prev => ({ ...prev, after: !prev.after }))}
                  />
                  {imageZoom.after && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="bg-white/90 px-2 py-1 rounded text-xs">
                        Spustelėkite sumažinti
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {inspectionStatus === 'unchecked' && (
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={() => setShowDamageForm(true)}
                  className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center"
                >
                  ⚠️ Pažeidimai aptikti
                </button>
                
                <button
                  onClick={markAsOK}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center"
                >
                  ✅ Viskas tvarkoj
                </button>
              </div>
            )}

            {/* Damage Form */}
            {showDamageForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6"
              >
                <h4 className="font-bold text-red-800 mb-4 flex items-center">
                  <span className="text-lg mr-2">⚠️</span>
                  Registruoti pažeidimą - {currentPair.category.label}
                </h4>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Pažeidimo aprašymas *
                  </label>
                  <textarea
                    value={damageDescription}
                    onChange={(e) => setDamageDescription(e.target.value)}
                    placeholder="Aprašykite pastebėtus pažeidimus..."
                    rows="4"
                    className="w-full px-4 py-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDamageForm(false);
                      setDamageDescription('');
                    }}
                    className="px-4 py-2 text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Atšaukti
                  </button>
                  <button
                    onClick={logDamage}
                    disabled={submittingDamage || !damageDescription.trim()}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                  >
                    {submittingDamage ? 'Išsaugoma...' : 'Registruoti pažeidimą'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Existing Damage Reports */}
            {booking.damageReports && booking.damageReports.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-red-800 mb-4">🚨 Užregistruoti pažeidimai</h4>
                <div className="space-y-3">
                  {booking.damageReports
                    .filter(report => report.category === currentPair.category.id)
                    .map((report) => (
                      <div key={report.id} className="bg-white border border-red-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-red-800">
                            {report.categoryLabel}
                          </span>
                          <span className="text-xs text-red-600">
                            {formatTimestamp(report.reportedAt)}
                          </span>
                        </div>
                        <p className="text-red-700 text-sm">{report.description}</p>
                        <p className="text-xs text-red-600 mt-2">
                          Registravo: {report.reportedBy}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Existing Inspection Reports */}
            {booking.inspectionReports && booking.inspectionReports.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-bold text-green-800 mb-4">✅ Patikrinimo ataskaitos</h4>
                <div className="space-y-3">
                  {booking.inspectionReports
                    .filter(report => report.category === currentPair.category.id)
                    .map((report) => (
                      <div key={report.id} className="bg-white border border-green-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-green-800">
                            {report.categoryLabel} - {report.status === 'ok' ? 'Viskas tvarkoj' : report.status}
                          </span>
                          <span className="text-xs text-green-600">
                            {formatTimestamp(report.checkedAt)}
                          </span>
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                          Patikrinta: {report.checkedBy}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-sand-beige/20 px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-graphite-black/70">
              Kategorija {currentCategoryIndex + 1} iš {comparisonPairs.length}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={goToPrevious}
                className="px-4 py-2 text-graphite-black bg-white border border-sand-beige rounded-lg hover:bg-graphite-black/5 transition-colors"
              >
                ← Ankstesnis
              </button>
              <button
                onClick={goToNext}
                className="px-4 py-2 text-graphite-black bg-white border border-sand-beige rounded-lg hover:bg-graphite-black/5 transition-colors"
              >
                Kitas →
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-graphite-black bg-white border border-sand-beige rounded-lg hover:bg-graphite-black/5 transition-colors"
              >
                Uždaryti
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ScooterImageComparison;