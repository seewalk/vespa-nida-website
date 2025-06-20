'use client';

import { useEffect, useState } from 'react';
import { auth } from '../../../lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/administracija/prisijungimas');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-ivory-white">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-graphite-black">
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Atsijungti
            </button>
          </div>

          <div className="bg-sage-green/10 p-4 rounded-lg mb-6">
            <p className="text-graphite-black">
              Sveiki, <strong>{user.email}</strong>!
            </p>
            <p className="text-sm text-graphite-black/70">
              Jūs sėkmingai prisijungėte prie administracijos skydelio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-sand-beige p-6 rounded-lg">
              <h3 className="font-bold mb-2">Užsakymai</h3>
              <p className="text-2xl font-bold text-sage-green">0</p>
            </div>
            
            <div className="bg-white border border-sand-beige p-6 rounded-lg">
              <h3 className="font-bold mb-2">Šiandien</h3>
              <p className="text-2xl font-bold text-sage-green">0</p>
            </div>
            
            <div className="bg-white border border-sand-beige p-6 rounded-lg">
              <h3 className="font-bold mb-2">Viso</h3>
              <p className="text-2xl font-bold text-sage-green">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}