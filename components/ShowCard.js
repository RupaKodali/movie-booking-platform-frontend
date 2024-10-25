// components/ShowCard.js
import Link from 'next/link';

const ShowCard = ({ show }) => {
  return (
    <div className="border p-4 rounded">
      <h3 className="text-lg">Show Time: {new Date(show.show_time).toLocaleString()}</h3>
      <p>Screen: {show.Screen.screen_number}</p>
      <p>Price: ${show.price}</p>
      {/* Updated Link to include screen_number as a query parameter */}
      <Link href={`/shows/${show.show_id}?screenNumber=${show.Screen.screen_number}`} className="text-blue-500 hover:underline">
        View Details
      </Link>
    </div>
  );
};

export default ShowCard;
