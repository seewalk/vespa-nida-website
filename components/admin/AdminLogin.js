'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '../../lib/firebase'; 
import { useRouter } from 'next/navigation';


export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (user.email !== 'admin@vespanida.lt') {
      setError('Neturite prieigos prie šios sekcijos.');
      return;
    }

    router.push('/administracija/valdymo-skydelis');
  } catch (err) {
    setError('Neteisingi prisijungimo duomenys.');
    console.error(err);
  }
};

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Administratoriaus prisijungimas</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="El. paštas"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Slaptažodis"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          Prisijungti
        </button>
      </form>
    </div>
  );
}