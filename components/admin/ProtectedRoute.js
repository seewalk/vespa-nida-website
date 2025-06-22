// components/admin/ProtectedRoute.js
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/administracija/prisijungimas');
        return;
      }

      // For now, check admin emails directly (we'll enhance this later)
      const ADMIN_EMAILS = ['admin@vespanida.lt', 'paula@vespanida.lt'];
      const isAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase());
      
      if (isAdmin) {
        setAuthorized(true);
      } else {
        await signOut(auth);
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
          <p className="text-graphite-black">Tikrinama prieiga...</p>
        </div>
      </div>
    );
  }

  return authorized ? children : null;
}