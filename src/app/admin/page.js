// src/app/admin/page.js
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AdminHome = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (!token) {
      router.push('/login');
      return;
    }});
  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>
      
      {/* Overview Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Movies Overview */}
        <div className="bg-white p-4 rounded shadow-lg">
          <h3 className="text-xl font-semibold">Movies</h3>
          <p className="text-gray-600">Manage all movies.</p>
          <Link href="/admin/movies" className="text-blue-500 mt-2 inline-block">
            View Movies
          </Link>
        </div>

        {/* Users Overview */}
        <div className="bg-white p-4 rounded shadow-lg">
          <h3 className="text-xl font-semibold">Users</h3>
          <p className="text-gray-600">Manage user accounts.</p>
          <Link href="/admin/users" className="text-blue-500 mt-2 inline-block">
            View Users
          </Link>
        </div>

        {/* Bookings Overview */}
        <div className="bg-white p-4 rounded shadow-lg">
          <h3 className="text-xl font-semibold">Bookings</h3>
          <p className="text-gray-600">Manage and view bookings.</p>
          <Link href="/admin/bookings" className="text-blue-500 mt-2 inline-block">
            View Bookings
          </Link>
        </div>

        {/* Theaters Overview */}
        <div className="bg-white p-4 rounded shadow-lg">
          <h3 className="text-xl font-semibold">Theaters</h3>
          <p className="text-gray-600">Manage theaters and screens.</p>
          <Link href="/admin/theaters" className="text-blue-500 mt-2 inline-block">
            View Theaters
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
