// src/app/components/BookingHandler.js
// Updated handleBooking function with payment integration
import { fetchApi, getUserIdFromToken } from '../helpers';

export const handleBookingWithPayment = async (
  showId,
  numTickets,
  setIsBooking,
  router,
  setRefreshShows,
  amount,
  orderId // The orderId from the payment gateway
) => {
  const token = localStorage.getItem('token');
  console.log('Token:', token);

  // Check if the user is logged in
  if (!token) {
    router.push('/login');
    return;
  }

  setIsBooking(true); // Set loading state

  try {
    // Proceed with creating the booking after payment confirmation
    const userId = await getUserIdFromToken(token); // Get user ID from token

    const bookingData = await fetchApi({
      route: '/bookings/create',
      method: 'POST',
      token,
      body: {
        user_id: userId,
        show_id: showId,
        order_id: orderId, // Use the PayPal orderId
        num_tickets: numTickets,
        // amount: amount, // Optionally pass the amount to the backend
      },
    });

    // Notify the user of the successful booking
    alert(`Booking successful! Booking ID: ${bookingData.booking_id}`);

    // Trigger a refresh in the parent component
    setRefreshShows(true);

    // Optionally, redirect the user to the bookings page or booking confirmation page
    router.push(`/bookings`);

  } catch (error) {
    alert(`Error creating booking: ${error.message}`);
    console.error('Booking error:', error);
  } finally {
    setIsBooking(false); // Reset loading state
  }
};
