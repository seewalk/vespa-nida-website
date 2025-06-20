'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { useRouter } from 'next/navigation';

const ADMIN_EMAILS = ['admin@vespanida.lt', 'paula@vespanida.lt'];

const isAdmin = (user) => {
  if (!user?.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // DEBUG: Check if auth is properly initialized
    console.log('Auth object:', auth);
    console.log('Auth app:', auth?.app);
    console.log('Auth config:', auth?.app?.options);

    try {
      // Check if auth is available
      if (!auth) {
        throw new Error('Firebase auth not initialized');
      }

      // Sign in with Firebase
      console.log('Attempting to sign in...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Sign in successful:', user.email);
      
      // Check if user is admin
      if (!isAdmin(user)) {
        console.log('User is not admin, signing out...');
        await signOut(auth);
        throw new Error('Neturite administratoriaus teisių');
      }
      
      console.log('Admin login successful, redirecting...');
      router.push('/administracija/valdymo-skydelis');
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Show user-friendly error messages
      if (err.message === 'Neturite administratoriaus teisių') {
        setError('Neturite administratoriaus teisių');
      } else if (err.message === 'Firebase auth not initialized') {
        setError('Firebase konfigūracijos klaida');
      } else if (err.code === 'auth/user-not-found') {
        setError('Vartotojas nerastas');
      } else if (err.code === 'auth/wrong-password') {
        setError('Neteisingas slaptažodis');
      } else if (err.code === 'auth/invalid-email') {
        setError('Neteisingas el. pašto formatas');
      } else {
        setError('Prisijungimo klaida: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component stays the same...
  return (
    <div className="min-h-screen bg-ivory-white flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-graphite-black mb-6 text-center">
          Administracija
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-graphite-black mb-2">
              El. paštas
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
              placeholder="admin@vespanida.lt"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-graphite-black mb-2">
              Slaptažodis
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-sand-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sage-green text-white py-3 px-4 rounded-lg font-medium hover:bg-sage-green/90 disabled:opacity-50"
          >
            {loading ? 'Prisijungiama...' : 'Prisijungti'}
          </button>
        </form>
      </div>
    </div>
  );
}