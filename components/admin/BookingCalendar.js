'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useLanguage } from '../context/LanguageContext';

export default function BookingCalendar({ 
  onDateSelect, 
  selectedDate, 
  adminMode = false, 
  onBookingUpdate 
}) {
  const { t } = useLanguage();
  
  // UNIFIED STATE - Use consistent date initialization across all domains
  const [currentDate, setCurrentDate] = useState(() => {
    // Always start with the same date regardless of domain
    const now = new Date();
    // Reset to first of month to ensure consistency
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState(null);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get current month and year - MEMOIZED
  const { currentMonth, currentYear } = useMemo(() => ({
    currentMonth: currentDate.getMonth(),
    currentYear: currentDate.getFullYear()
  }), [currentDate]);

  // MEMOIZED calendar calculations
  const calendarData = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    return {
      firstDayOfMonth,
      lastDayOfMonth,
      daysInMonth,
      startingDayOfWeek
    };
  }, [currentMonth, currentYear]);

  // OPTIMIZED: Create a lookup map for bookings by date
  const bookingsByDate = useMemo(() => {
    const dateMap = new Map();
    
    bookings.forEach(booking => {
      if (booking.booking?.startDate && booking.status !== 'cancelled') {
        const date = booking.booking.startDate;
        if (!dateMap.has(date)) {
          dateMap.set(date, []);
        }
        dateMap.get(date).push(booking);
      }
    });
    
    // Only log summary info, not every date
    if (bookings.length > 0) {
      console.log(`📊 Processed ${bookings.length} bookings into date map`);
      const datesWithBookings = Array.from(dateMap.keys()).filter(date => dateMap.get(date).length > 0);
      if (datesWithBookings.length > 0) {
        console.log(`📅 Dates with bookings:`, datesWithBookings);
      }
    }
    
    return dateMap;
  }, [bookings]);

  // UNIFIED MONTH NAMES - consistent across all languages
  const getMonthName = useCallback((monthIndex) => {
    const monthKeys = [
      'calendar.months.january', 'calendar.months.february', 'calendar.months.march',
      'calendar.months.april', 'calendar.months.may', 'calendar.months.june',
      'calendar.months.july', 'calendar.months.august', 'calendar.months.september',
      'calendar.months.october', 'calendar.months.november', 'calendar.months.december'
    ];
    
    // Fallback month names for all languages
    const fallbackMonths = {
      lt: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      pl: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']
    };
    
    // Get current language from hostname or default to 'lt'
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    let lang = 'lt';
    if (hostname.includes('en.')) lang = 'en';
    else if (hostname.includes('de.')) lang = 'de';
    else if (hostname.includes('pl.')) lang = 'pl';
    
    return t(monthKeys[monthIndex], fallbackMonths[lang][monthIndex]);
  }, [t]);

  // UNIFIED DAY NAMES - consistent across all languages
  const getDayNames = useCallback(() => {
    const dayKeys = [
      'calendar.days.sunday', 'calendar.days.monday', 'calendar.days.tuesday',
      'calendar.days.wednesday', 'calendar.days.thursday', 'calendar.days.friday', 'calendar.days.saturday'
    ];
    
    // Fallback day names for all languages
    const fallbackDays = {
      lt: ['Sek', 'Pir', 'Ant', 'Tre', 'Ket', 'Pen', 'Šeš'],
      en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      pl: ['Nie', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob']
    };
    
    // Get current language from hostname or default to 'lt'
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    let lang = 'lt';
    if (hostname.includes('en.')) lang = 'en';
    else if (hostname.includes('de.')) lang = 'de';
    else if (hostname.includes('pl.')) lang = 'pl';
    
    return dayKeys.map((key, index) => t(key, fallbackDays[lang][index]));
  }, [t]);

  // UNIFIED DATA FETCHING - same query for all domains
  const fetchMonthBookings = useCallback(async () => {
    if (!isClient) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log(`🗓️ Fetching bookings for ${currentYear}-${currentMonth + 1} from Firebase`);
      
      // Get first and last day of current month
      const firstDay = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
      const lastDay = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
      
      console.log(`📅 Date range: ${firstDay} to ${lastDay}`);
      
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
      
      console.log(`📊 Found ${bookingsData.length} bookings for ${currentYear}-${currentMonth + 1}`);
      setBookings(bookingsData);
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      setError(error.message);
      setBookings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear, isClient]);

  useEffect(() => {
    fetchMonthBookings();
  }, [fetchMonthBookings]);

  // OPTIMIZED: Get bookings for date using the lookup map
  const getBookingsForDate = useCallback((date) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    const dayBookings = bookingsByDate.get(dateStr) || [];
    
    // ONLY log dates that have bookings to reduce console spam
    if (dayBookings.length > 0) {
      console.log(`📅 ${dateStr}: ${dayBookings.length} booking(s)`);
    }
    
    return dayBookings;
  }, [currentMonth, currentYear, bookingsByDate]);

  // CONSISTENT BOOKING LOGIC - same across all domains
  const isDateAvailable = useCallback((date) => {
    const dateBookings = getBookingsForDate(date);
    // Check if all 2 scooters are booked
    return dateBookings.length < 2;
  }, [getBookingsForDate]);

  const getDateAvailabilityColor = useCallback((date) => {
    const dateBookings = getBookingsForDate(date);
    const available = 2 - dateBookings.length;
    
    if (available === 2) return 'bg-green-100 border-green-300'; // Both available
    if (available === 1) return 'bg-yellow-100 border-yellow-300'; // One available
    return 'bg-red-100 border-red-300'; // None available
  }, [getBookingsForDate]);

  const isDateInPast = useCallback((date) => {
    const today = new Date();
    const checkDate = new Date(currentYear, currentMonth, date);
    return checkDate < today.setHours(0, 0, 0, 0);
  }, [currentMonth, currentYear]);

  const handleDateClick = useCallback((date) => {
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
  }, [adminMode, currentMonth, currentYear, getBookingsForDate, isDateInPast, onDateSelect]);

  const navigateMonth = useCallback((direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentMonth + direction);
    setCurrentDate(newDate);
  }, [currentDate, currentMonth]);

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      console.log('Updating booking:', bookingId, 'to status:', newStatus);
      
      const bookingRef = doc(db, 'bookings', bookingId);
      
      await updateDoc(bookingRef, {
        status: newStatus,
        'metadata.updatedAt': new Date()
      });
      
      console.log('Booking updated successfully');
      
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));
      
      if (onBookingUpdate) {
        onBookingUpdate();
      }
      
      alert(t('calendar.bookingUpdated', 'Booking updated successfully!'));
      
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert(t('calendar.updateError', 'Error updating booking: ') + error.message);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!confirm(t('calendar.confirmDelete', 'Are you sure you want to delete this booking?'))) return;
    
    try {
      console.log('Deleting booking:', bookingId);
      
      await deleteDoc(doc(db, 'bookings', bookingId));
      
      console.log('Booking deleted successfully');
      
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      setShowBookingModal(false);
      
      if (onBookingUpdate) {
        onBookingUpdate();
      }
      
      alert(t('calendar.bookingDeleted', 'Booking deleted successfully!'));
      
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert(t('calendar.deleteError', 'Error deleting booking: ') + error.message);
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
    const statusMap = {
      pending_confirmation: t('calendar.status.pending', 'Pending Confirmation'),
      confirmed: t('calendar.status.confirmed', 'Confirmed'),
      completed: t('calendar.status.completed', 'Completed'),
      cancelled: t('calendar.status.cancelled', 'Cancelled')
    };
    return statusMap[status] || status;
  };

  const renderCalendarGrid = useCallback(() => {
    const days = [];
    const { daysInMonth, startingDayOfWeek } = calendarData;
    
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
            
            {/* Show booking count indicator */}
            {dayBookings.length > 0 && (
              <div className="flex-1 flex flex-col justify-end">
                <div className="text-xs text-center">
                  <span className={`inline-block w-4 h-4 rounded-full text-white text-xs leading-4 ${
                    dayBookings.length >= 2 ? 'bg-red-500' : 'bg-yellow-500'
                  }`}>
                    {dayBookings.length}
                  </span>
                </div>
                
                {/* Admin mode: Show booking status indicators */}
                {adminMode && (
                  <div className="space-y-0.5 mt-1">
                    {dayBookings.slice(0, 2).map((booking, index) => (
                      <div
                        key={booking.id}
                        className={`w-full h-1 rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-400' :
                          booking.status === 'pending_confirmation' ? 'bg-yellow-400' :
                          booking.status === 'completed' ? 'bg-blue-400' :
                          'bg-red-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  }, [calendarData, getBookingsForDate, isDateAvailable, isDateInPast, selectedDate, currentYear, currentMonth, adminMode, getDateAvailabilityColor, handleDateClick]);

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

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
        <div className="text-center text-red-600">
          <p className="font-medium">Error loading calendar</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={fetchMonthBookings}
            className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const dayNames = getDayNames();

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
          {getMonthName(currentMonth)} {currentYear}
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
          <span className="font-medium">{t('calendar.availableScooters', 'Available Scooters')}:</span> 2 {t('calendar.units', 'units')}.
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
                <span>{t('calendar.legend.bothAvailable', 'Both scooters available')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
                <span>{t('calendar.legend.oneAvailable', '1 scooter available')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded mr-2"></div>
                <span>{t('calendar.legend.allBooked', 'All scooters booked')}</span>
              </div>
            </>
          ) : (
            // Admin legend - booking status colors
            <>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span>{t('calendar.status.confirmed', 'Confirmed')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span>{t('calendar.status.pending', 'Pending')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                <span>{t('calendar.status.completed', 'Completed')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                <span>{t('calendar.status.cancelled', 'Cancelled')}</span>
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
            <h3 className="text-xl font-bold mb-4">{t('calendar.bookingDetails', 'Booking Details')}</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-graphite-black/60">{t('calendar.bookingNumber', 'Booking #')}:</span>
                <span className="font-medium">{selectedBooking.bookingReference}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">{t('calendar.customer', 'Customer')}:</span>
                <span className="font-medium">{selectedBooking.customer?.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">{t('calendar.email', 'Email')}:</span>
                <a href={`mailto:${selectedBooking.customer?.email}`} className="text-sage-green hover:underline">
                  {selectedBooking.customer?.email}
                </a>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">{t('calendar.phone', 'Phone')}:</span>
                <a href={`tel:${selectedBooking.customer?.phone}`} className="text-sage-green hover:underline">
                  {selectedBooking.customer?.phone}
                </a>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">{t('calendar.status.label', 'Status')}:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedBooking.status)}`}>
                  {getStatusText(selectedBooking.status)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">{t('calendar.vespa', 'Vespa')}:</span>
                <span className="font-medium">{selectedBooking.booking?.vespaModel}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-graphite-black/60">{t('calendar.amount', 'Amount')}:</span>
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
                    {t('calendar.confirm', 'Confirm')}
                  </button>
                  <button
                    onClick={() => {
                      updateBookingStatus(selectedBooking.id, 'cancelled');
                      setShowBookingModal(false);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                  >
                    {t('calendar.cancel', 'Cancel')}
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
                  {t('calendar.markCompleted', 'Mark as Completed')}
                </button>
              )}
              
              <button
                onClick={() => deleteBooking(selectedBooking.id)}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
              >
                {t('calendar.deleteBooking', 'Delete Booking')}
              </button>
              
              <button
                onClick={() => setShowBookingModal(false)}
                className="w-full px-4 py-2 border border-sage-green text-sage-green rounded-lg hover:bg-sage-green/5 text-sm"
              >
                {t('calendar.close', 'Close')}
              </button>
            </div>
          </>
        )}
      </SimpleModal>
    </div>
  );
}