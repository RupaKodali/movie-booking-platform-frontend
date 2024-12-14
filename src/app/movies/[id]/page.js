// src/app/movies/[id]/page.js
'use client'

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/app/helpers';
import { handleBookingWithPayment } from '../../components/BookingHandler';
import PayPalButton from '../../components/PayPalButton';

const MovieDetailPage = ({ params }) => {
  const { id } = use(params);
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshShows, setRefreshShows] = useState(false); // Track refresh trigger
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0] // Set default to current date
);    
const [filteredTheaters, setFilteredTheaters] = useState([]); // Track filtered theaters

async function fetchMovieData(date) {
  try {
    const data = await fetchApi({ route: `/theaters/movies/${id}?date=${date}` });
    setMovieData(data);
    setFilteredTheaters(data.Theaters); // Initialize with all theaters
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}
  useEffect(() => {
    fetchMovieData(selectedDate);
  }, [id, refreshShows]);

  const handleDateFilter = (date) => {
    console.log(date)
    setSelectedDate(date);

    if (date) {
        fetchMovieData(date)
    } else {
        setFilteredTheaters(movieData.Theaters); // Reset to all theaters if no date is selected
    }
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const { title, genre, duration, rating, Theaters } = movieData;

  return (
    <div className="p-5 bg-gray-100 text-black">
      <h1 className="text-2xl font-bold ">{title}</h1>
      <p className="text-black">Genre: {genre}</p>
      <p className="text-black">Duration: {duration} minutes</p>
      <p className="text-black">Rating: {rating}</p>
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
      <h2 className="text-xl font-semibold text-black mt-6">Theaters Showing This Movie:</h2>
      <ul className="space-y-4">
        {filteredTheaters.map(theater => (
          <li key={theater.theater_id} className="border p-4 bg-white shadow rounded">
            <h3 className="text-lg text-black">{theater.theater_name}</h3>
            <p className="text-black">Location: {theater.location}</p>

            <h4 className="text-md font-semibold text-black mt-4">Shows:</h4>
            <ShowList shows={theater.Shows}
              setRefreshShows={setRefreshShows} // Pass setter to ShowList
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const ShowList = ({ shows, setRefreshShows }) => {
  const [expandedShows, setExpandedShows] = useState({});
  const [numTickets, setNumTickets] = useState({});
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
      [showId]: !prev[showId],
    }));
  };

  const handleLoginRedirect = () => {
    router.push('/login'); // Redirect to login page
  };

  const handleTicketChange = (showId, value) => {
    setNumTickets((prev) => ({
      ...prev,
      [showId]: value,
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
                <p className="text-black">Price: ${(show.price).toFixed(2)}</p>
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
                {/* <button
                    onClick={() => handleBooking(showId, numTickets[showId] || 1, setIsBooking, router, setRefreshShows)}
                    className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    disabled={isBooking}
                  >
                    {isBooking ? 'Booking...' : 'Book'}
                  </button> */}
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

export default MovieDetailPage;