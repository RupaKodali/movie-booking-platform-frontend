// pages/theater/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ShowCard from '../../components/ShowCard';

const TheaterDetailPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the theater ID from the URL
  const [theater, setTheater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTheaterDetails = async () => {
      if (id) {
        try {
          const response = await fetch(`${process.env.BACKEND_HOST}/theaters/movies?theaterId=${id}`);
          const data = await response.json();

          if (response.ok) {
            setTheater(data);
          } else {
            setError(data.message || 'Error fetching theater details');
          }
        } catch (err) {
          setError('Failed to fetch theater details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTheaterDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!theater) return <div>No theater found.</div>;

  return (
    <div className="theater-detail-page">
      <h1 className="text-2xl font-bold mb-4">{theater.theater_name}</h1>
      <p>Location: {theater.location}</p>
      <h2 className="text-xl font-bold mt-4">Movies Playing:</h2>
      <ul>
        {theater.Movies.map((movie) => (
          <li key={movie.movie_id} className="mt-2">
            <h3 className="text-lg font-semibold">{movie.title}</h3>
            <p>Genre: {movie.genre}</p>
            <p>Duration: {movie.duration} minutes</p>
            <p>Rating: {movie.rating}</p>
            <h4 className="text-md font-semibold">Showtimes:</h4>
            <ul>
              {movie.Shows.map((show) => (
                <ShowCard key={show.show_id} show={show} />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TheaterDetailPage;
