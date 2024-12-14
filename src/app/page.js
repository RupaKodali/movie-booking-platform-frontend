// src/app/page.js

'use client'; // Ensure this is added for client-side code in Next.js 13+

import { useRouter } from 'next/navigation'; 
import React from 'react';

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/movies'); // Redirects to the movies page
  };

  return (
    <section className="text-center py-16">
      <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to Movie Booking Platform</h1>
      <p className="text-lg text-gray-600">Book tickets for your favorite movies here!</p>
      <button
        onClick={handleGetStarted}
        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Get Started
      </button>
    </section>
  );
}
