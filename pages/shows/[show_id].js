// pages/shows/[show_id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ShowDetails = () => {
  const router = useRouter();
  const { show_id } = router.query; // Get show ID from the URL
  const [show, setShow] = useState(null);
  const [screenNumber, setScreenNumber] = useState('');
  const [numTickets, setNumTickets] = useState(1); // State for number of tickets
  const [bookingMessage, setBookingMessage] = useState('');

  useEffect(() => {
    if (show_id) {
      // Fetch the show details
      fetch(`${process.env.BACKEND_HOST}/shows/${show_id}`)
        .then((response) => response.json())
        .then((data) => {
          setShow(data);
          setScreenNumber(router.query.screenNumber || ''); // Get screen number from query
        })
        .catch((error) => console.error('Error fetching show details:', error));
    }
  }, [show_id, router.query.screenNumber]);

  // Function to handle booking
  const handleBooking = () => {
    const user_id = 1; // Replace with the logged-in user's ID

    // Booking data
    const bookingData = {
      user_id,
      show_id: show_id,
      num_tickets: numTickets,
    };

    // Make POST request to create a booking
    fetch(`${process.env.BACKEND_HOST}/bookings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
      .then((response) => response.json())
      .then((data) => {
        setBookingMessage(`Booking successful! Booking ID: ${data.booking_id}`);
        setShow((prevShow) => ({
          ...prevShow,
          seating_capacity: prevShow.seating_capacity - numTickets,
        }));
      })
      .catch((error) => {
        console.error('Error creating booking:', error);
        setBookingMessage('Booking failed. Please try again.');
      });
  };

  // Function to increment the number of tickets
  const incrementTickets = () => {
    if (numTickets < show.seating_capacity) {
      setNumTickets((prev) => prev + 1);
    }
  };

  // Function to decrement the number of tickets
  const decrementTickets = () => {
    if (numTickets > 1) {
      setNumTickets((prev) => prev - 1);
    }
  };

  if (!show) return <p>Loading show details...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Show Details</h1>
      <h2 className="text-lg">Screen Number: {screenNumber}</h2>
      <p>Show Time: {new Date(show.show_time).toLocaleString()}</p>
      <p>Price: ${show.price.toFixed(2)}</p>
      <p>Seating Capacity: {show.seating_capacity}</p>
      <p>Theater: {show.Theater.theater_name}</p>
      <p>Location: {show.Theater.location}</p>
      
      <div className="mt-4 flex items-center">
        <button
          onClick={decrementTickets}
          className="bg-gray-300 px-2 py-1 rounded-l"
        >
          -
        </button>
        <input
          type="number"
          value={numTickets}
          min="1"
          max={show.seating_capacity}
          onChange={(e) => setNumTickets(Math.max(1, Math.min(show.seating_capacity, Number(e.target.value))))}
          className="border text-center w-16"
        />
        <button
          onClick={incrementTickets}
          className="bg-gray-300 px-2 py-1 rounded-r"
        >
          +
        </button>
      </div>

      <button
        onClick={handleBooking}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Book Now
      </button>

      {bookingMessage && <p className="mt-4">{bookingMessage}</p>}
    </div>
  );
};

export default ShowDetails;
