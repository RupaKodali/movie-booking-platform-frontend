// src/app/admin/theaters/page.js
'use client';

import { fetchApi } from '@/app/helpers';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const TheatersPage = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (!token) {
      router.push('/login');
      return;
    };
    const fetchTheaters = async () => {
      try {

        const data = await fetchApi({
            route: '/theaters/admin/list',
            method: 'GET',
            token,
          });
        setTheaters(data);
      } catch (error) {
        console.error('Error fetching theaters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }
  // console.log(JSON.stringify(theaters));

  return (
    <div className="container mx-auto px-4 py-8 text-black">
            <div className="flex items-center justify-between mb-4">

      <h1 className="text-2xl font-bold mb-6">Theater List</h1>
      <Link
          href="/admin/theaters/create"
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
        >
          Create New Movie
        </Link>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {theaters.map((theater) => (
          <div
            key={theater.theater_id}
            className="border border-gray-300 shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">
            <Link href={`/admin/theaters/${theater.theater_id}`}>{theater.theater_name}</Link>
            </h2>
            <p className="text-gray-600">Location: {theater.location}</p>
            <p className="text-gray-600">Screen Count: {theater.screen_count}</p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default TheatersPage;
