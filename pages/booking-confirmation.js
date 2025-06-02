// pages/booking-confirmation/[id].jsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '../../components/context/LanguageContext';

export default function BookingConfirmation() {
  const router = useRouter();
  const { id, status } = router.query;
  const { t } = useLanguage();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      // Fetch booking details
      fetch(`/api/bookings/${id}`)
        .then(res => res.json())
        .then(data => {
          setBooking(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching booking:', err);
          setLoading(false);
        });
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="w-16 h-16 border-4 border-sage-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>{t('booking.loading')}</p>
      </div>
    );
  }
  
  return (
    <section className="py-24 bg-ivory-white">
      <div className="container">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
          {status === 'success' ? (
            <>
              <div className="w-20 h-20 rounded-full bg-sage-green/20 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-sage-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold font-syne text-center mb-6">{t('booking.success.title')}</h1>
              
              <div className="mb-8">
                <p className="text-center text-graphite-black/70 mb-4">
                  {t('booking.success.message')}
                </p>
                <p className="text-center text-sm bg-sage-green/5 rounded-lg p-4">
                  {t('booking.success.emailSent')}
                </p>
              </div>
              
              {booking && (
                <div className="border-t border-b border-sand-beige py-6 mb-6">
                  <h2 className="text-xl font-bold font-syne mb-4">{t('booking.confirmation.details')}</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-graphite-black/50">{t('booking.confirmation.bookingRef')}</p>
                      <p className="font-medium">{booking.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-graphite-black/50">{t('booking.confirmation.status')}</p>
                      <p className="font-medium">
                        <span className="inline-block bg-green-100 text-green-800 rounded px-2 py-1 text-xs">
                          {t('booking.confirmation.confirmed')}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-graphite-black/50">{t('booking.steps.personal.model')}</p>
                      <p className="font-medium">{booking.model}</p>
                    </div>
                    <div>
                      <p className="text-sm text-graphite-black/50">{t('booking.steps.personal.duration')}</p>
                      <p className="font-medium">{booking.rentalDays} {booking.rentalDays === 1 ? t('booking.steps.personal.day') : t('booking.steps.personal.days')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-graphite-black/50">{t('booking.steps.personal.pickup')}</p>
                      <p className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-graphite-black/50">{t('booking.steps.personal.dropoff')}</p>
                      <p className="font-medium">{new Date(booking.endDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-graphite-black/50">{t('booking.confirmation.depositPaid')}</p>
                      <p className="font-medium">€{(booking.rentalPrice * 0.25).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-graphite-black/50">{t('booking.confirmation.remainingBalance')}</p>
                      <p className="font-medium">€{(booking.rentalPrice * 0.75).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <a href="/" className="btn-primary text-center">
                  {t('booking.confirmation.backToHome')}
                </a>
                <a href="#explore" className="px-6 py-3 border border-sage-green text-sage-green rounded-lg text-center font-medium hover:bg-sage-green/5 transition-colors">
                  {t('booking.success.exploreRoutes')}
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold font-syne text-center mb-6">{t('booking.failed.title')}</h1>
              
              <p className="text-center text-graphite-black/70 mb-6">
                {t('booking.failed.message')}
              </p>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => {
                    // Retry payment
                    fetch(`/api/retry-payment/${id}`)
                      .then(res => res.json())
                      .then(data => {
                        if (data.success) {
                          window.location.href = data.paymentUrl;
                        }
                      });
                  }}
                  className="btn-primary"
                >
                  {t('booking.failed.retry')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}