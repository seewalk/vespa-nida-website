'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function BookingCalendar({ 
  onDateSelect, 
  selectedDate, 
  adminMode = false, 
  onBookingUpdate 
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of the month and how many days in month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Month names
  const monthNames = [
    'Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
    'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'
  ];

  // Day names
  const dayNames = ['Sek', 'Pir', 'Ant', 'Tre', 'Ket', 'Pen', 'Šeš'];

  useEffect(() => {
    if (isClient) {
      fetchMonthBookings();
    }
  }, [currentMonth, currentYear, isClient]);

  const fetchMonthBookings = async () => {
    try {
      setLoading(true);
      
      // Get first and last day of current month
      const firstDay = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
      const lastDay = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
      
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('booking.startDate', '>=', firstDay),
        where('booking.startDate', '<=', lastDay)
      );
      
      const snapshot = await getDocs(q);
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBookingsForDate = (date) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    return bookings.filter(booking => 
      booking.booking?.startDate === dateStr && 
      booking.status !== 'cancelled' // Don't count cancelled bookings
    );
  };

  const isDateAvailable = (date) => {
    const dateBookings = getBookingsForDate(date);
    // Check if all 2 scooters are booked
    return dateBookings.length < 2;
  };

  const getDateAvailabilityColor = (date) => {
    const dateBookings = getBookingsForDate(date);
    const available = 2 - dateBookings.length;
    
    if (available === 2) return 'bg-green-100 border-green-300'; // Both available
    if (available === 1) return 'bg-yellow-100 border-yellow-300'; // One available
    return 'bg-red-100 border-red-300'; // None available
  };

  const isDateInPast = (date) => {
    const today = new Date();
    const checkDate = new Date(currentYear, currentMonth, date);
    return checkDate < today.setHours(0, 0, 0, 0);
  };

  const handleDateClick = (date) => {
    if (isDateInPast(date)) return;
    
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    
    if (adminMode) {
      // Show bookings for this date
      const dayBookings = getBookingsForDate(date);
      if (dayBookings.length > 0) {
        setSelectedBooking(dayBookings[0]);
        setShowBookingModal(true);
      }
    } else {
      // Customer booking mode
      if (onDateSelect) {
        onDateSelect(dateStr);
      }
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentMonth + direction);
    setCurrentDate(newDate);
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      console.log('Updating booking:', bookingId, 'to status:', newStatus);
      
      const bookingRef = doc(db, 'bookings', bookingId);
      
      // Use a simpler update structure
      await updateDoc(bookingRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      console.log('Booking updated successfully');
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
      
      if (onBookingUpdate) {
        onBookingUpdate();
      }
      
      // Show success message
      alert('Užsakymas sėkmingai atnaujintas!');
      
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Klaida atnaujinant užsakymą: ' + error.message);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!confirm('Ar tikrai norite ištrinti šį užsakymą?')) return;
    
    try {
      console.log('Deleting booking:', bookingId);
      
      await deleteDoc(doc(db, 'bookings', bookingId));
      
      console.log('Booking deleted successfully');
      
      // Update local state
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      setShowBookingModal(false);
      
      if (onBookingUpdate) {
        onBookingUpdate();
      }
      
      alert('Užsakymas sėkmingai ištrintas!');
      
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('Klaida trinant užsakymą: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending_confirmation: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending_confirmation: 'Laukia patvirtinimo',
      confirmed: 'Patvirtinta',
      completed: 'Baigta',
      cancelled: 'Atšaukta'
    };
    return statusTexts[status] || status;
  };

  const renderCalendarGrid = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square p-1"></div>
      );
    }
    
    // Days of the month
    for (let date = 1; date <= daysInMonth; date++) {
      const dayBookings = getBookingsForDate(date);
      const isAvailable = isDateAvailable(date);
      const isPast = isDateInPast(date);
      const isSelected = selectedDate === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      
      days.push(
        <div
          key={date}
          className={`aspect-square p-1 cursor-pointer transition-all duration-200 rounded-lg border-2 ${
            isPast 
              ? 'opacity-50 cursor-not-allowed border-transparent bg-gray-50' 
              : isSelected
              ? 'border-sage-green bg-sage-green/10'
              : adminMode
              ? 'border-transparent hover:border-sage-green/50 hover:bg-sage-green/5'
              : getDateAvailabilityColor(date) + ' hover:opacity-80'
          }`}
          onClick={() => handleDateClick(date)}
        >
          <div className="h-full flex flex-col">
            <div className={`text-sm font-medium ${
              isPast ? 'text-gray-400' : 'text-graphite-black'
            }`}>
              {date}
            </div>
            
            {/* Admin mode: Show booking status indicators */}
            {adminMode && dayBookings.length > 0 && (
              <div className="flex-1 flex flex-col justify-end">
                <div className="space-y-0.5">
                  {dayBookings.slice(0, 2).map((booking, index) => (
                    <div
                      key={booking.id}
                      className={`w-full h-1.5 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-400' :
                        booking.status === 'pending_confirmation' ? 'bg-yellow-400' :
                        booking.status === 'completed' ? 'bg-blue-400' :
                        'bg-red-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  // Simple modal without framer-motion
  const SimpleModal = ({ children, show, onClose }) => {
    if (!show) return null;
    
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    );
  };

  // Show loading state if not client-side yet
  if (!isClient) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-sand-beige p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-sand-beige p-4 relative">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-sage-green/10 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-graphite-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-lg md:text-xl font-bold text-graphite-black">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-sage-green/10 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-graphite-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Availability Info */}
      <div className="mb-4 p-3 bg-sage-green/5 rounded-lg border border-sage-green/20">
        <div className="text-sm text-graphite-black">
          <span className="font-medium">Prieinami skuteriai:</span> 2 vnt.
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-graphite-black/70 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarGrid()}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-sand-beige">
        <div className="flex flex-wrap gap-4 text-xs">
          {!adminMode ? (
            // Customer legend - availability colors
            <>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></div>
                <span>Laisvi abu skuteriai</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
                <span>Laisvas 1 skuteris</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
                <span>Visi skuteriai užimti</span>
              </div>
            </>
          ) : (
            // Admin legend - booking status colors
            <>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span>Patvirtinta</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span>Laukia patvirtinimo</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                <span>Baigta</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                <span>Atšaukta</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-green"></div>
        </div>
      )}

      {/* Booking Details Modal */}
      <SimpleModal show={showBookingModal} onClose={() => setShowBookingModal(false)}>
        {selectedBooking && (
          <>
            <h3 className="text-xl font-bold mb-4">Užsakymo detalės</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-graphite-black/60">Užsakymo nr.:</span>
                <span className="font-medium">{selectedBooking.bookingReference}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">Klientas:</span>
                <span className="font-medium">{selectedBooking.customer?.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">El. paštas:</span>
                <a href={`mailto:${selectedBooking.customer?.email}`} className="text-sage-green hover:underline">
                  {selectedBooking.customer?.email}
                </a>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">Telefonas:</span>
                <a href={`tel:${selectedBooking.customer?.phone}`} className="text-sage-green hover:underline">
                  {selectedBooking.customer?.phone}
                </a>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">Būsena:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedBooking.status)}`}>
                  {getStatusText(selectedBooking.status)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">Vespa:</span>
                <span className="font-medium">{selectedBooking.booking?.vespaModel}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">Suma:</span>
                <span className="font-medium">€{selectedBooking.pricing?.totalAmount}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 space-y-2">
              {selectedBooking.status === 'pending_confirmation' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'confirmed');
                      setShowBookingModal(false);
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                  >
                    Patvirtinti
                  </button>
                  <button
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'cancelled');
                      setShowBookingModal(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                  >
                    Atšaukti
                  </button>
                </div>
              )}
              
              {selectedBooking.status === 'confirmed' && (
                <button
                  onClick={() => {
                    updateBookingStatus(selectedBooking.id, 'completed');
                    setShowBookingModal(false);
                  }}
                  className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                >
                  Pažymėti kaip baigtą
                </button>
              )}
              
              <button
                onClick={() => deleteBooking(selectedBooking.id)}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
              >
                Ištrinti užsakymą
              </button>
              
              <button
                onClick={() => setShowBookingModal(false)}
                className="w-full px-4 py-2 border border-sage-green text-sage-green rounded-lg hover:bg-sage-green/5 text-sm"
              >
                Uždaryti
              </button>
            </div>
          </>
        )}
      </SimpleModal>
    </div>
  );
}