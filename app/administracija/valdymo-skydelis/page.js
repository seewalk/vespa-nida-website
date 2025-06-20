'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    todayBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    upcomingBookings: [],
    alertsCount: 0
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchDashboardData();
      } else {
        router.push('/administracija/prisijungimas');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, orderBy('metadata.createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const bookings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate dashboard metrics
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      
      const metrics = {
        totalBookings: bookings.length,
        todayBookings: bookings.filter(b => b.booking?.startDate === today).length,
        pendingBookings: bookings.filter(b => b.status === 'pending_confirmation').length,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
        totalRevenue: bookings
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + (b.pricing?.totalAmount || 0), 0),
        recentBookings: bookings.slice(0, 5),
        upcomingBookings: bookings
          .filter(b => b.booking?.startDate >= today && b.status !== 'cancelled')
          .sort((a, b) => new Date(a.booking.startDate) - new Date(b.booking.startDate))
          .slice(0, 5),
        alertsCount: bookings.filter(b => 
          b.status === 'pending_confirmation' || 
          (b.booking?.startDate === today && b.status === 'confirmed')
        ).length
      };

      setDashboardData(metrics);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const formatPrice = (price) => `€${price || 0}`;
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('lt-LT');
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleString('lt-LT');
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-green mx-auto mb-4"></div>
          <p className="text-graphite-black">Kraunama...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-ivory-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-graphite-black font-syne">
                Administracijos skydelis
              </h1>
              <p className="text-graphite-black/70 mt-1">
                Sveiki sugrįžę, {user.email}
              </p>
            </div>
            
            {/* Alerts Badge */}
            {dashboardData.alertsCount > 0 && (
              <div className="relative">
                <Link
                  href="/administracija/uzsakymai"
                  className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {dashboardData.alertsCount} perspėjimas(ai)
                </Link>
              </div>
            )}
          </div>
          
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-sand-beige p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-graphite-black/60">Visi užsakymai</p>
                  <p className="text-2xl font-bold text-graphite-black">{dashboardData.totalBookings}</p>
                </div>
                <div className="w-12 h-12 bg-sage-green/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-sage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Today's Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-sand-beige p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-graphite-black/60">Šiandienos užsakymai</p>
                  <p className="text-2xl font-bold text-graphite-black">{dashboardData.todayBookings}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Pending Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-sand-beige p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-graphite-black/60">Laukia patvirtinimo</p>
                  <p className="text-2xl font-bold text-yellow-600">{dashboardData.pendingBookings}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Total Revenue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm border border-sand-beige p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-graphite-black/60">Bendros pajamos</p>
                  <p className="text-2xl font-bold text-sage-green">{formatPrice(dashboardData.totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Status Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link href="/administracija/uzsakymai?status=pending_confirmation">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-sand-beige p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{dashboardData.pendingBookings}</p>
                <p className="text-sm text-graphite-black/60">Laukia patvirtinimo</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/administracija/uzsakymai?status=confirmed">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-sm border border-sand-beige p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{dashboardData.confirmedBookings}</p>
                <p className="text-sm text-graphite-black/60">Patvirtinti</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/administracija/uzsakymai?status=completed">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-lg shadow-sm border border-sand-beige p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{dashboardData.completedBookings}</p>
                <p className="text-sm text-graphite-black/60">Baigti</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/administracija/uzsakymai?status=cancelled">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-lg shadow-sm border border-sand-beige p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{dashboardData.cancelledBookings}</p>
                <p className="text-sm text-graphite-black/60">Atšaukti</p>
              </div>
            </motion.div>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-lg shadow-sm border border-sand-beige"
          >
            <div className="p-6 border-b border-sand-beige">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-graphite-black">Naujausi užsakymai</h3>
                <Link
                  href="/administracija/uzsakymai"
                  className="text-sage-green hover:underline text-sm"
                >
                  Žiūrėti visus →
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-sand-beige">
              {dashboardData.recentBookings.length > 0 ? (
                dashboardData.recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-graphite-black">
                          {booking.customer?.name || 'N/A'}
                        </h4>
                        <p className="text-sm text-graphite-black/60">
                          #{booking.bookingReference}
                        </p>
                        <p className="text-xs text-graphite-black/50">
                          {formatDateTime(booking.metadata?.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(booking.status)}
                        <p className="text-sm font-medium text-sage-green mt-1">
                          {formatPrice(booking.pricing?.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-graphite-black/60">
                  <svg className="w-12 h-12 mx-auto mb-4 text-graphite-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p>Užsakymų dar nėra</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Upcoming Bookings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-lg shadow-sm border border-sand-beige"
          >
            <div className="p-6 border-b border-sand-beige">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-graphite-black">Būsimi užsakymai</h3>
                <Link
                  href="/administracija/uzsakymai?dateRange=upcoming"
                  className="text-sage-green hover:underline text-sm"
                >
                  Žiūrėti visus →
                </Link>
              </div>
            </div>
            
            <div className="divide-y divide-sand-beige">
              {dashboardData.upcomingBookings.length > 0 ? (
                dashboardData.upcomingBookings.map((booking) => (
                  <div key={booking.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-graphite-black">
                          {booking.customer?.name || 'N/A'}
                        </h4>
                        <p className="text-sm text-graphite-black/60">
                          {formatDate(booking.booking?.startDate)}
                        </p>
                        <p className="text-xs text-graphite-black/50">
                          {booking.booking?.vespaModel}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(booking.status)}
                        <p className="text-sm font-medium text-sage-green mt-1">
                          {formatPrice(booking.pricing?.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-graphite-black/60">
                  <svg className="w-12 h-12 mx-auto mb-4 text-graphite-black/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>Būsimų užsakymų nėra</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-8 bg-white rounded-lg shadow-sm border border-sand-beige p-6"
        >
          <h3 className="text-lg font-bold text-graphite-black mb-4">Greitos nuorodos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/administracija/uzsakymai"
              className="flex items-center p-4 border border-sage-green rounded-lg hover:bg-sage-green/5 transition-colors group"
            >
              <div className="w-10 h-10 bg-sage-green/10 group-hover:bg-sage-green/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-sage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-graphite-black">Valdyti užsakymus</p>
                <p className="text-sm text-graphite-black/60">Peržiūrėti ir redaguoti užsakymus</p>
              </div>
            </Link>

            <Link
              href="/administracija/kalendorius"
              className="flex items-center p-4 border border-sage-green rounded-lg hover:bg-sage-green/5 transition-colors group"
            >
              <div className="w-10 h-10 bg-sage-green/10 group-hover:bg-sage-green/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-sage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-graphite-black">Kalendorius</p>
                <p className="text-sm text-graphite-black/60">Peržiūrėti užsakymus kalendoriuje</p>
              </div>
            </Link>

            <button
              onClick={() => window.location.href = `mailto:support@vespanida.lt?subject=Admin Support`}
              className="flex items-center p-4 border border-sage-green rounded-lg hover:bg-sage-green/5 transition-colors group"
            >
              <div className="w-10 h-10 bg-sage-green/10 group-hover:bg-sage-green/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-sage-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-graphite-black">Pagalba</p>
                <p className="text-sm text-graphite-black/60">Susisiekti su palaikymu</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
