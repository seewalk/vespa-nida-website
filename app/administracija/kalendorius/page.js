'use client';

import { useEffect, useState } from 'react';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BookingCalendar from '../../../components/admin/BookingCalendar';

export default function AdminCalendar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/administracija/prisijungimas');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

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
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link 
            href="/administracija/valdymo-skydelis"
            className="text-sage-green hover:underline text-sm mb-2 block"
          >
            ← Atgal į valdymo skydelį
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-graphite-black">
            Užsakymų kalendorius
          </h1>
          <p className="text-graphite-black/70 mt-2">
            Peržiūrėkite ir valdykite užsakymus kalendoriuje
          </p>
        </div>

        <BookingCalendar 
          adminMode={true}
          onBookingUpdate={() => {
            // Refresh any parent components if needed
            console.log('Booking updated');
          }}
        />
      </div>
    </div>
  );
}