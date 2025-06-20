'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminBookings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: ''
  });
  const [updating, setUpdating] = useState(null);
  const [emailSending, setEmailSending] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();
  const [emailLogs, setEmailLogs] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchBookings();
      } else {
        router.push('/administracija/prisijungimas');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
  if (expandedBooking) {
    fetchEmailLogs(expandedBooking);
  }
}, [expandedBooking]);

  const fetchBookings = async () => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, orderBy('metadata.createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Add notification
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  // Filter bookings based on current filters
  useEffect(() => {
    let filtered = [...bookings];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      switch (filters.dateRange) {
        case 'today':
          filtered = filtered.filter(booking => booking.booking?.startDate === todayStr);
          break;
        case 'upcoming':
          filtered = filtered.filter(booking => booking.booking?.startDate >= todayStr);
          break;
        case 'past':
          filtered = filtered.filter(booking => booking.booking?.startDate < todayStr);
          break;
      }
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.customer?.name?.toLowerCase().includes(searchLower) ||
        booking.customer?.email?.toLowerCase().includes(searchLower) ||
        booking.customer?.phone?.includes(filters.search) ||
        booking.bookingReference?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, filters]);

  const updateBookingStatus = async (bookingId, newStatus) => {
    setUpdating(bookingId);
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        status: newStatus,
        'metadata.updatedAt': new Date()
      });
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));

      addNotification(`Užsakymo būsena pakeista į "${getStatusText(newStatus)}"`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      addNotification('Klaida keičiant būseną', 'error');
    } finally {
      setUpdating(null);
    }
  };

  // Send email workflow updates
  // Update this in your admin component
const sendWorkflowEmail = async (bookingId, emailType) => {
  setEmailSending(`${bookingId}-${emailType}`);
  try {
    // Trigger n8n webhook for email sending
    const webhookPayload = {
      event: 'manual_email_trigger',
      bookingId,
      emailType,
      booking: bookings.find(b => b.id === bookingId),
      timestamp: new Date().toISOString()
    };

    const response = await fetch('https://seewalk.app.n8n.cloud/webhook-test/booking-automation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });

    if (response.ok) {
      // Update local state immediately (optimistic update)
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { 
              ...booking, 
              workflow: { 
                ...booking.workflow, 
                [emailType]: true 
              }
            }
          : booking
      ));

      addNotification('El. laiškas išsiųstas sėkmingai!');
    }
  } catch (error) {
    console.error('Error sending workflow email:', error);
    addNotification('Klaida siunčiant el. laišką', 'error');
  } finally {
    setEmailSending(null);
  }
};

// Enhanced function to fetch email logs
const fetchEmailLogs = async (bookingId) => {
  try {
    // First allow public access to the function
    const response = await fetch(`https://getemaillogs-cghjkpazfa-uc.a.run.app?bookingId=${bookingId}`);
    
    if (response.ok) {
      const data = await response.json();
      setEmailLogs(prev => ({ ...prev, [bookingId]: data.logs || [] }));
    } else {
      console.error('Failed to fetch email logs:', response.status);
    }
  } catch (error) {
    console.error('Error fetching email logs:', error);
  }
};

const getStatusBadge = (status) => {
  const statusConfig = {
    pending_confirmation: { text: 'Laukia patvirtinimo', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    confirmed: { text: 'Patvirtintas', color: 'bg-green-100 text-green-800 border-green-200' },
    completed: { text: 'Baigtas', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    cancelled: { text: 'Atšauktas', color: 'bg-red-100 text-red-800 border-red-200' }
  };
  
  const config = statusConfig[status] || { text: status, color: 'bg-gray-100 text-gray-800 border-gray-200' };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.text}
    </span>
  );
};

const getStatusText = (status) => {
  const statusTexts = {
    pending_confirmation: 'Laukia patvirtinimo',
    confirmed: 'Patvirtintas',
    completed: 'Baigtas',
    cancelled: 'Atšauktas'
  };
  return statusTexts[status] || status;
};

const formatPrice = (price) => {
  return `€${price || 0}`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('lt-LT');
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp.seconds * 1000).toLocaleString('lt-LT');
};

const getRentalTypeText = (type) => {
  const types = {
    full: 'Pilna diena',
    morning: 'Rytas (9:00-15:30)',
    evening: 'Vakaras (16:30-23:00)'
  };
  return types[type] || type;
};

// Workflow steps configuration
const workflowSteps = [
  { key: 'confirmationEmailSent', label: 'Patvirtinimo laiškas', icon: '📧' },
  { key: 'contractEmailSent', label: 'Sutarties laiškas', icon: '📄' },
  { key: 'contractSigned', label: 'Sutartis pasirašyta', icon: '✍️', noButton: true },
  { key: 'paymentProcessed', label: 'Mokėjimas apdorotas', icon: '💳' },
  { key: 'thankYouEmailSent', label: 'Padėkos laiškas', icon: '🙏' }
];

if (loading) {
  return (
    <div className="min-h-screen bg-ivory-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-green mx-auto mb-4"></div>
        <p>Kraunama...</p>
      </div>
    </div>
  );
}

  if (!user) return null;

  return (
    <div className="min-h-screen bg-ivory-white">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
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
                  : 'bg-green-500 text-white'
              }`}
            >
              {notification.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 mb-6">
          <div>
            <Link 
              href="/administracija/valdymo-skydelis"
              className="text-sage-green hover:underline text-sm mb-2 block"
            >
              ← Atgal į valdymo skydelį
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-graphite-black">
              Užsakymai ({filteredBookings.length})
            </h1>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="space-y-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Ieškoti pagal vardą, el. paštą, telefoną ar užsakymo numerį..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green focus:border-sage-green"
              />
            </div>

            {/* Status and Date Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-graphite-black mb-2">Būsena</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
                >
                  <option value="all">Visos būsenos</option>
                  <option value="pending_confirmation">Laukia patvirtinimo</option>
                  <option value="confirmed">Patvirtintas</option>
                  <option value="completed">Baigtas</option>
                  <option value="cancelled">Atšauktas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-graphite-black mb-2">Laikotarpis</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
                >
                  <option value="all">Visi laikotarpiai</option>
                  <option value="today">Šiandien</option>
                  <option value="upcoming">Būsimi</option>
                  <option value="past">Praėję</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-sand-beige overflow-hidden">
                {/* Booking Header */}
                <div className="p-4 border-b border-sand-beige bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-graphite-black text-lg">
                        {booking.customer?.name || 'N/A'}
                      </h3>
                      <p className="text-sm text-graphite-black/70">
                        #{booking.bookingReference}
                      </p>
                      <p className="text-xs text-graphite-black/50 mt-1">
                        Sukurta: {formatDateTime(booking.metadata?.createdAt)}
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end space-y-2">
                      {getStatusBadge(booking.status)}
                      <p className="text-lg font-bold text-sage-green">
                        {formatPrice(booking.pricing?.totalAmount)}
                      </p>
                      <button
                        onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                        className="px-3 py-1 bg-sage-green text-white rounded text-xs hover:bg-sage-green/90 transition-colors"
                      >
                        {expandedBooking === booking.id ? 'Suskleisti' : 'Išskleisti'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex justify-between md:block">
                      <span className="text-graphite-black/60">El. paštas:</span>
                      <a href={`mailto:${booking.customer?.email}`} className="text-sage-green hover:underline">
                        {booking.customer?.email}
                      </a>
                    </div>
                    
                    <div className="flex justify-between md:block">
                      <span className="text-graphite-black/60">Data:</span>
                      <span className="font-medium">{formatDate(booking.booking?.startDate)}</span>
                    </div>
                    
                    <div className="flex justify-between md:block">
                      <span className="text-graphite-black/60">Vespa:</span>
                      <span className="font-medium">{booking.booking?.vespaModel}</span>
                    </div>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-sand-beige">
                    <div className="flex flex-wrap gap-2">
                      {booking.status === 'pending_confirmation' && (
                        <>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            disabled={updating === booking.id}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 text-sm"
                          >
                            {updating === booking.id ? 'Keičiama...' : 'Patvirtinti'}
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            disabled={updating === booking.id}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm"
                          >
                            Atšaukti
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          disabled={updating === booking.id}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 text-sm"
                        >
                          Pažymėti kaip baigtą
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedBooking === booking.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 bg-gray-50/50">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Customer Details */}
                          <div className="bg-white rounded-lg p-4">
                            <h4 className="font-bold text-graphite-black mb-3 flex items-center">
                              <span className="text-lg mr-2">👤</span>
                              Kliento informacija
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Vardas:</span>
                                <span className="font-medium">{booking.customer?.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">El. paštas:</span>
                                <a href={`mailto:${booking.customer?.email}`} className="text-sage-green hover:underline">
                                  {booking.customer?.email}
                                </a>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Telefonas:</span>
                                <a href={`tel:${booking.customer?.phone}`} className="text-sage-green hover:underline">
                                  {booking.customer?.phone}
                                </a>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Amžius:</span>
                                <span className="font-medium">{booking.customer?.age} metai</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Teisės:</span>
                                <span className="font-medium">{booking.customer?.drivingLicense}</span>
                              </div>
                            </div>
                          </div>

                          {/* Booking Details */}
                          <div className="bg-white rounded-lg p-4">
                            <h4 className="font-bold text-graphite-black mb-3 flex items-center">
                              <span className="text-lg mr-2">🛵</span>
                              Rezervacijos detalės
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Vespa modelis:</span>
                                <span className="font-medium">{booking.booking?.vespaModel}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Data:</span>
                                <span className="font-medium">{formatDate(booking.booking?.startDate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Tipas:</span>
                                <span className="font-medium">{getRentalTypeText(booking.booking?.rentalType)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Papildomas šalmas:</span>
                                <span className="font-medium">{booking.booking?.additionalHelmet ? 'Taip' : 'Ne'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Maršrutas:</span>
                                <span className="font-medium">{booking.booking?.route || 'Nepasirinktas'}</span>
                              </div>
                              {booking.booking?.message && (
                                <div className="pt-2 border-t border-sand-beige">
                                  <span className="text-graphite-black/60">Žinutė:</span>
                                  <p className="font-medium italic mt-1">"{booking.booking.message}"</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Pricing Details */}
                          <div className="bg-white rounded-lg p-4">
                            <h4 className="font-bold text-graphite-black mb-3 flex items-center">
                              <span className="text-lg mr-2">💰</span>
                              Kainodara
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Bazinė kaina:</span>
                                <span className="font-medium">{formatPrice(booking.pricing?.basePrice)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Šalmo kaina:</span>
                                <span className="font-medium">{formatPrice(booking.pricing?.helmetPrice)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Tarpinė suma:</span>
                                <span className="font-medium">{formatPrice(booking.pricing?.subtotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-graphite-black/60">Užstatas:</span>
                                <span className="font-medium">{formatPrice(booking.pricing?.securityDeposit)}</span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-sand-beige">
                                <span className="text-graphite-black font-medium">Iš viso:</span>
                                <span className="font-bold text-sage-green text-lg">{formatPrice(booking.pricing?.totalAmount)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Workflow Management */}
<div className="bg-white rounded-lg p-4">
  <div className="flex justify-between items-center mb-3">
    <h4 className="font-bold text-graphite-black flex items-center">
      <span className="text-lg mr-2">⚡</span>
      Darbo eiga
    </h4>
    <button
      onClick={() => {
        // Toggle logs for this specific booking
        const currentLogs = emailLogs[booking.id];
        if (!currentLogs) {
          fetchEmailLogs(booking.id);
        }
      }}
      className="text-xs text-sage-green hover:underline"
    >
      Atnaujinti logus
    </button>
  </div>
  
  <div className="space-y-3">
    {workflowSteps.map((step) => {
      // Get email status from logs
      const logs = emailLogs[booking.id] || [];
      const latestLog = logs.find(log => log.emailType === step.key);
      const status = latestLog ? latestLog.status : (booking.workflow?.[step.key] ? 'success' : 'pending');
      const error = latestLog?.error;
      
      const getStatusIcon = (status) => {
        switch (status) {
          case 'success': return '✅';
          case 'failed': return '❌';
          case 'pending': return '⏳';
          default: return '⚪';
        }
      };

      const getStatusColor = (status) => {
        switch (status) {
          case 'success': return 'text-green-600 bg-green-50';
          case 'failed': return 'text-red-600 bg-red-50';
          case 'pending': return 'text-yellow-600 bg-yellow-50';
          default: return 'text-gray-400 bg-gray-50';
        }
      };
      
      return (
        <div key={step.key} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <span>{step.icon}</span>
              <span className="text-sm">{step.label}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                {getStatusIcon(status)} {status}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {status === 'failed' && (
                <button
                  onClick={() => sendWorkflowEmail(booking.id, step.key)}
                  disabled={emailSending === `${booking.id}-${step.key}`}
                  className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:opacity-50"
                >
                  {emailSending === `${booking.id}-${step.key}` ? 'Bandoma...' : 'Bandyti dar kartą'}
                </button>
              )}
              
              {!step.noButton && status === 'pending' && (
                <button
                  onClick={() => sendWorkflowEmail(booking.id, step.key)}
                  disabled={emailSending === `${booking.id}-${step.key}`}
                  className="px-3 py-1 bg-sage-green text-white rounded text-xs hover:bg-sage-green/90 disabled:opacity-50"
                >
                  {emailSending === `${booking.id}-${step.key}` ? 'Siunčiama...' : 'Siųsti'}
                </button>
              )}
            </div>
          </div>
          
          {/* Show error message if failed */}
          {status === 'failed' && error && (
            <div className="ml-6 text-xs text-red-600 bg-red-50 p-2 rounded">
              <strong>Klaida:</strong> {error}
            </div>
          )}
        </div>
      );
    })}
  </div>

  {/* Email Logs Section */}
  {emailLogs[booking.id] && emailLogs[booking.id].length > 0 && (
    <div className="mt-4 pt-4 border-t border-sand-beige">
      <h5 className="text-sm font-medium text-graphite-black mb-2">El. laiškų logai</h5>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {emailLogs[booking.id].slice(0, 3).map((log) => (
          <div key={log.id} className={`text-xs p-2 rounded ${
            log.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <div className="flex justify-between items-start">
              <span className="font-medium">
                {workflowSteps.find(s => s.key === log.emailType)?.label || log.emailType}
              </span>
              <span className="font-medium">
                {log.status === 'success' ? '✅' : '❌'}
              </span>
            </div>
            <div className="text-gray-500 mt-1">
              {new Date(log.timestamp).toLocaleString('lt-LT')}
            </div>
            {log.error && (
              <div className="mt-1">
                <strong>Klaida:</strong> {log.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )}
</div>

                          {/* Documents Status */}
                          <div className="bg-white rounded-lg p-4 lg:col-span-2">
                            <h4 className="font-bold text-graphite-black mb-3 flex items-center">
                              <span className="text-lg mr-2">📋</span>
                              Dokumentai ir parašas
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-graphite-black/60">Nuomos sutartis:</span>
                                  <span className={`font-medium ${booking.documents?.rental ? 'text-green-600' : 'text-red-600'}`}>
                                    {booking.documents?.rental ? 'Patvirtinta ✓' : 'Nepatvirtinta ✗'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-graphite-black/60">Perdavimo sutartis:</span>
                                  <span className={`font-medium ${booking.documents?.handover ? 'text-green-600' : 'text-red-600'}`}>
                                    {booking.documents?.handover ? 'Patvirtinta ✓' : 'Nepatvirtinta ✗'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-graphite-black/60">Saugumo taisyklės:</span>
                                  <span className={`font-medium ${booking.documents?.safety ? 'text-green-600' : 'text-red-600'}`}>
                                    {booking.documents?.safety ? 'Patvirtinta ✓' : 'Nepatvirtinta ✗'}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-graphite-black/60">Dokumentai priimti:</span>
                                  <span className="font-medium">{formatDateTime(booking.documents?.acceptedAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-graphite-black/60">Parašas pateiktas:</span>
                                  <span className={`font-medium ${booking.documents?.signature ? 'text-green-600' : 'text-red-600'}`}>
                                    {booking.documents?.signature ? 'Taip ✓' : 'Ne ✗'}
                                  </span>
                                </div>
                                {booking.documents?.signature && (
                                  <button
                                    onClick={() => {
                                      const newWindow = window.open();
                                      newWindow.document.write(`<img src="${booking.documents.signature}" style="max-width:100%;">`);
                                    }}
                                    className="px-3 py-1 bg-sage-green text-white rounded text-xs hover:bg-sage-green/90"
                                  >
                                    Peržiūrėti parašą
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Metadata */}
                          <div className="bg-white rounded-lg p-4 lg:col-span-2">
                            <h4 className="font-bold text-graphite-black mb-3 flex items-center">
                              <span className="text-lg mr-2">📊</span>
                              Metaduomenys
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              <div>
                                <span className="text-graphite-black/60">Sukurta:</span>
                                <p className="font-medium">{formatDateTime(booking.metadata?.createdAt)}</p>
                              </div>
                              <div>
                                <span className="text-graphite-black/60">Atnaujinta:</span>
                                <p className="font-medium">{formatDateTime(booking.metadata?.updatedAt)}</p>
                              </div>
                              <div>
                                <span className="text-graphite-black/60">Kalba:</span>
                                <p className="font-medium">{booking.metadata?.language?.toUpperCase()}</p>
                              </div>
                              <div className="md:col-span-3">
                                <span className="text-graphite-black/60">Naršyklė:</span>
                                <p className="font-medium text-xs break-all">{booking.metadata?.userAgent}</p>
                              </div>
                              <div>
                                <span className="text-graphite-black/60">Šaltinis:</span>
                                <p className="font-medium">{booking.metadata?.source}</p>
                              </div>
                              <div>
                                <span className="text-graphite-black/60">Sesijos ID:</span>
                                <p className="font-medium">{booking.metadata?.sessionId}</p>
                              </div>
                              <div>
                                <span className="text-graphite-black/60">Nukreipėjas:</span>
                                <p className="font-medium">{booking.metadata?.referrer || 'Tiesioginis'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-graphite-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-graphite-black mb-2">Užsakymų nerasta</h3>
              <p className="text-graphite-black/60">
                {filters.status !== 'all' || filters.dateRange !== 'all' || filters.search
                  ? 'Pabandykite pakeisti filtrus'
                  : 'Užsakymų dar nėra'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}