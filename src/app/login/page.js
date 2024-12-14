// src/app/login/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi } from '../helpers';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if(email=='admin@gmail.com'){
        router.push("/admin")
      }else{
      router.push('/bookings');
      }
    }
  }, [router]);



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const data = await fetchApi({
          route: '/users/login',
          method: 'POST',
          body: { email, password },
      });
    if (data) {
        localStorage.setItem('token', data.token);
        if(email=='admin@gmail.com'){
          localStorage.setItem('user','ADMIN')
          window.location.href = '/admin'; 
        }else{
        window.location.href = '/bookings'; 
        }
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-black">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block mb-2 text-black">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-black">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">Login</button>
      </form>
      <p className="mt-4 text-center text-black">
        Not a user?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
