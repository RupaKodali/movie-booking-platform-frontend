'use client'

import { use, useEffect, useState } from 'react';
import { handleBookingWithPayment } from '@/app/components/BookingHandler';
import PayPalButton from '@/app/components/PayPalButton';
import { fetchApi } from '@/app/helpers';
import { useRouter } from 'next/navigation';

const TheaterDetailPage = ({ params }) => {
    const { id } = use(params);
    const [theaterData, setTheaterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshShows, setRefreshShows] = useState(false); // Track refresh trigger
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0] // Set default to current date
    );
    const [filteredTheaters, setFilteredTheaters] = useState([]); // Track filtered theaters
    async function fetchTheaterData(date) {
        try {
            const data = await fetchApi({ route: `/movies/theatres/${id}?date=${date}` });
            setTheaterData(data);
            setFilteredTheaters(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchTheaterData(selectedDate);
    }, [id, refreshShows]);

    const handleDateFilter = (date) => {
        console.log(date)
        setSelectedDate(date);

        if (date) {
            fetchTheaterData(date)
        } else {
            setFilteredTheaters(movieData.Theaters); // Reset to all theaters if no date is selected
        }
    };
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const { theater_name, location, Movies } = theaterData;
    return (

        <div className="p-5 bg-gray-100 text-black">
            <div className="border p-4 mb-4 bg-white shadow rounded">
                <h2 className="text-2xl font-bold ">{theater_name}</h2>
                <p className="text-black">Location: {location}</p>
                {/* Date Filter */}
                <div className="mb-4">
                    <label htmlFor="filterDate" className="mr-2 font-bold">
                        Filter by Date:
                    </label>
                    <input
                        type="date"
                        id="filterDate"
                        value={selectedDate}
                        onChange={(e) => handleDateFilter(e.target.value)}
                        className="border px-2 py-1 rounded"
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
                <h3 className="text-xl font-semibold text-black mt-6">Movies Showing:</h3>
                <ul className="space-y-4">
                    {Movies.map((movie) => {
                        const { title, genre, duration, rating, Shows } = movie;
                        return (
                            <li key={movie.movie_id} className="border p-4 bg-white shadow rounded">
                                <h4 className="text-xl font-semibold text-black">{title}</h4>
                                <p className="text-black">Genre: {genre}</p>
                                <p className="text-black">Duration: {duration} minutes</p>
                                <p className="text-black">Rating: {rating}</p>

                                <h4 className="text-lg font-semibold text-black mt-6">Shows for this Movie:</h4>
                                <ul className="space-y-4">
                                    {Shows.map((show) => (
                                        <li key={show.show_id} className="border p-4 bg-white shadow rounded">
                                            <div className="text-black">
                                                <p>Show Time: {new Date(show.show_time).toLocaleString()}</p>
                                                <p>Price: ${show.price}</p>
                                                <p>Seating Capacity: {show.seating_capacity}</p>
                                                <p>Screen Number: {show.Screen.screen_number}</p>
                                            </div>

                                            <ShowList
                                                shows={[show]}  // Pass a single show for ShowList
                                                setRefreshShows={setRefreshShows} // Pass setter to ShowList
                                            />
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

const ShowList = ({ shows, setRefreshShows }) => {
    const [expandedShows, setExpandedShows] = useState({}); // Track expanded states
    const [numTickets, setNumTickets] = useState({}); // Track ticket numbers
    const [isBooking, setIsBooking] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsUserLoggedIn(!!token); // Set state based on whether a token exists
    }, [])

    const toggleShowDetails = (showId) => {
        setExpandedShows((prev) => ({
            ...prev,
            [showId]: !prev[showId], // Toggle the expanded state for the specific show
        }));
    };

    const handleLoginRedirect = () => {
        router.push('/login'); // Redirect to login page
    };

    const handleTicketChange = (showId, value) => {
        setNumTickets((prev) => ({
            ...prev,
            [showId]: value, // Set the ticket number for the specific show
        }));
    };

    const onPaymentSuccess = async (showId, numTickets, setIsBooking, router, setRefreshShows, amount, details) => {
        try {
            alert('Payment successful!');
            // Call the handleBookingWithPayment function
            await handleBookingWithPayment(
                showId,
                numTickets,
                setIsBooking,
                router,
                setRefreshShows,
                amount,
                details.id // Use the PayPal payment ID or transaction ID
            );

            return true; // Return true to confirm payment success
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment failed. Please try again.');
            return false; // Return false to indicate failure
        }
    };

    return (
        <ul className="space-y-2">
            {shows.map(show => {
                const showId = show.show_id;
                const amount = show.price * (numTickets[showId] || 1); // Calculate total amount based on tickets

                return (
                    <li key={showId} className="border p-2 bg-gray-50 rounded">
                        <div onClick={() => toggleShowDetails(showId)} className="cursor-pointer">
                            <p className="text-black">Show Time: {new Date(show.show_time).toLocaleString()}</p>
                        </div>
                        {expandedShows[showId] && (
                            <div className="mt-2">
                                <p className="text-black">Price: ${show.price}</p>
                                <p className="text-black">Seating Capacity: {show.seating_capacity}</p>
                                <p className="text-black">Screen Number: {show.Screen.screen_number}</p>
                                <label className="block mt-2 text-black">
                                    Number of Tickets:
                                    <input
                                        type="number"
                                        value={numTickets[showId] || 1}
                                        min="1"
                                        max="8"
                                        onChange={(e) => handleTicketChange(showId, e.target.value)}
                                        className="border rounded p-1 w-full"
                                    />
                                </label>
                                {isUserLoggedIn ? (
                                    <div className="mt-2">
                                        <PayPalButton
                                            bookingDetails={{ amount }}
                                            onPaymentSuccess={(details) => {
                                                onPaymentSuccess(
                                                    showId,
                                                    numTickets[showId] || 1,
                                                    setIsBooking,
                                                    router,
                                                    setRefreshShows,
                                                    amount,
                                                    details // Pass PayPal's payment details to the function
                                                )
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleLoginRedirect}
                                        className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                    >
                                        Login to Book
                                    </button>
                                )}

                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default TheaterDetailPage;