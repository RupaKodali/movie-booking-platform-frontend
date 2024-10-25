// components/TheaterCard.js
import Link from 'next/link';

const TheaterCard = ({ theater }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 m-2">
      <h2 className="text-xl font-bold">{theater.theater_name}</h2>
      <p>Location: {theater.location}</p>
      <Link href={`/theaters/${theater.theater_id}`} className="text-blue-500 hover:underline">
        View Movies
      </Link>
    </div>
  );
};

export default TheaterCard;
