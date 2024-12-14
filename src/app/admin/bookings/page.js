//src/app/admin/bookings/page.js
'use client';

import { fetchApi } from '@/app/helpers';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const data = await fetchApi({
            route: '/bookings/',
            method: 'GET',
            token,
          });
          setBookings(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Bookings List</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2 text-left">Booking ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">User Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>

            <th className="border border-gray-300 px-4 py-2 text-left">Movie</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Theater</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Show ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Booking Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Number of Tickets</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.booking_id} className="hover:bg-gray-100">
            <td className="border border-gray-300 px-4 py-2">{booking.booking_id}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.User.name}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.User.email}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.User.phone_number}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.Show.Movie.title}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.Show.Theater.theater_name}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.show_id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(booking.booking_date).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">{booking.num_tickets}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsPage;
