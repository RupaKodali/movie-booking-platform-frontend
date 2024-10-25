// pages/movies/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const MovieDetails = () => {
  const router = useRouter();
  const { id } = router.query; // Get movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [theaters, setTheaters] = useState([]);

  useEffect(() => {
    if (id) {
      // Fetch the movie details
      fetch(`${process.env.BACKEND_HOST}/movies/${id}`)
        .then((response) => response.json())
        .then((data) => setMovie(data))
        .catch((error) => console.error('Error fetching movie details:', error));

      // Fetch the theaters showing this movie
      fetch(`${process.env.BACKEND_HOST}/theaters/movies?movieId=${id}`)
        .then((response) => response.json())
        .then((data) => setTheaters(data))
        .catch((error) => console.error('Error fetching theaters:', error));
    }
  }, [id]);

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{movie.title}</h1>
      <h2 className="text-lg">Theaters Showing "{movie.title}":</h2>
      {theaters.length === 0 ? (
        <p>No theaters found for this movie.</p>
      ) : (
        theaters.map((theater) => (
          <div key={theater.theater_id} className="border p-4 rounded mb-4">
            <h3 className="text-xl font-semibold">{theater.theater_name}</h3>
            <p>Location: {theater.location}</p>
            <h4 className="font-bold">Showtimes:</h4>
            {theater.Shows.length === 0 ? (
              <p>No showtimes available.</p>
            ) : (
              theater.Shows.map((show) => (
                <div key={show.show_id} className="ml-4">
                  <Link href={`/shows/${show.show_id}?screenNumber=${show.Screen.screen_number}`} className="text-blue-600 hover:underline">
                    Screen Number: {show.Screen.screen_number}
                  </Link>
                  <p>Show Time: {new Date(show.show_time).toLocaleString()}</p>
                  <p>Price: ${show.price.toFixed(2)}</p>
                  <p>Seating Capacity: {show.seating_capacity}</p>
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MovieDetails;
