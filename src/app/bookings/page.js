'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {getUserIdFromToken, fetchApi} from '../helpers'

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Get the token from localStorage (or sessionStorage)
        const token = localStorage.getItem('token');

        if (!token) {
            // If no token is found, redirect to login
            router.push('/login');
            return;
        }
        
        const setData = async() =>{
            const userId = await getUserIdFromToken(token); 

            try {
                const data = await fetchApi({
                    route: `/bookings/user/${userId}`,
                    method: 'GET',
                    token
                });
                // const data = await fetchApi({ route: `/bookings/user/${userId}`, token });
                setBookings(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error('Failed to fetch user bookings:', error);
            }
        }

        setData();
        
    }, [router]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-5 bg-gray-100">
            <h1 className="text-2xl font-bold text-black">Your Bookings</h1>
            <ul className="space-y-4 mt-4">
                {bookings.length === 0 ? (
                    <p>No bookings found.</p>
                ) : (
                    bookings.map((booking) => (
                        <li key={booking.booking_id} className="border p-4 bg-white shadow rounded">
                            <h3 className="text-xl text-black font-semibold">Booking ID: {booking.booking_id}</h3>
                            <p className="text-black">Booking Date: {new Date(booking.booking_date).toLocaleString()}</p>
                            <p className="text-black">Number of Tickets: {booking.num_tickets}</p>
                            <p className="text-black">Price per Ticket: ${(booking.Show.price).toFixed(2)}</p>
                            <p className="text-black">Total Price: ${(booking.num_tickets * booking.Show.price).toFixed(2)}</p>
                            <p className="text-black">Show Time: {new Date(booking.Show.show_time).toLocaleString()}</p>
                            <p className="text-black">Theater Name: {booking.Show.Theater.theater_name}</p>
                            <p className="text-black">Location: {booking.Show.Theater.location}</p>
                            {/* Optionally, add more details like movie name if available */}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default BookingList;
