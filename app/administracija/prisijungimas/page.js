'use client';

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '../../../lib/firebase';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(null);
  const router = useRouter();
  
  const functions = getFunctions();
  const verifyAdmin = httpsCallable(functions, 'verifyAdmin');

  // Rate limiting - lockout after 5 failed attempts
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const result = await verifyAdmin();
          if (result.data.isAdmin) {
            router.push('/administracija/valdymo-skydelis');
          } else {
            await signOut(auth);
          }
        } catch (error) {
          await signOut(auth);
        }
      }
    });

    // Check lockout status
    const lockoutEnd = localStorage.getItem('adminLockout');
    if (lockoutEnd && Date.now() < parseInt(lockoutEnd)) {
      setLockoutTime(parseInt(lockoutEnd));
    }

    return () => unsubscribe();
  }, []);

  // Clear lockout when time expires
  useEffect(() => {
    if (lockoutTime && Date.now() >= lockoutTime) {
      setLockoutTime(null);
      setAttempts(0);
      localStorage.removeItem('adminLockout');
    }
  }, [lockoutTime]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Check if locked out
    if (lockoutTime && Date.now() < lockoutTime) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
      setError(`Prisijungimas užblokuotas`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Verify admin status on server
      const result = await verifyAdmin();
      
      if (!result.data.isAdmin) {
        await signOut(auth);
        throw new Error('Neturite administratoriaus teisių');
      }
      
      // Reset attempts on successful login
      setAttempts(0);
      localStorage.removeItem('adminLockout');
      
      // Redirect to dashboard
      router.push('/administracija/valdymo-skydelis');
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Increment failed attempts
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      // Lock out after max attempts
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutEnd = Date.now() + LOCKOUT_DURATION;
        setLockoutTime(lockoutEnd);
        localStorage.setItem('adminLockout', lockoutEnd.toString());
        setError(`Prisijungimas užblokuotas`);
      } else {
        
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const isLockedOut = lockoutTime && Date.now() < lockoutTime;

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

        {isLockedOut && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg mb-6">
            <p className="font-medium">🔒 Prisijungimas užblokuotas</p>
            <p className="text-sm mt-1">
              Dėl saugumo priežasčių prisijungimas užblokuojamas po kelių nesėkmingų bandymų.
            </p>
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
              disabled={isLockedOut}
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
              disabled={isLockedOut}
            />
          </div>

          <button
            type="submit"
            disabled={loading || isLockedOut}
            className="w-full bg-sage-green text-white py-3 px-4 rounded-lg font-medium hover:bg-sage-green/90 disabled:opacity-50"
          >
            {loading ? 'Prisijungiama...' : 'Prisijungti'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Bandymų: {attempts}/{MAX_ATTEMPTS}</p>
        </div>
      </div>
    </div>
  );
}