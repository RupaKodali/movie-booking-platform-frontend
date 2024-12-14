// src/app/admin/movies/create/page.js
'use client'

import { useState, useEffect } from 'react';
import { fetchApi } from '@/app/helpers'; 
import { useRouter } from 'next/navigation';

const CreateMoviePage = () => {
  const router = useRouter();

  const [movie, setMovie] = useState({
    title: '',
    genre: '',
    duration: '',
    rating: '',
  });

  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if the user is authenticated when the page mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirect to login if no token is found
    }

    const fetchGenres = async () => {
      try {
        const response = await fetchApi({
          route: '/movies/genres',  // API endpoint for genres
          method: 'GET',
          token: localStorage.getItem('token'),
        });
        setGenres(response.genres);  // Assuming the response is a list of genres
      } catch (err) {
        setError('Failed to fetch genres');
      }
    };

    fetchGenres();
  }, [router]); // Empty dependency array makes it run once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!movie.title || !movie.genre || !movie.duration || !movie.rating) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);  // Start loading

    try {
      const token = localStorage.getItem('token');
      const response = await fetchApi({
        route: '/movies/',
        method: 'POST',
        token,
        body: {
          title: movie.title,
          genre: movie.genre,
          duration: parseInt(movie.duration, 10),
          rating: parseInt(movie.rating, 10),
        }
      });

      setSuccess(true);
      setMovie({ title: '', genre: '', duration: '', rating: '' });
      setError(null);
      setLoading(false);

      // Optionally redirect after success
      router.push('/admin/movies'); // Redirect to movie list page after success
    } catch (err) {
      setError(err.message);
      setSuccess(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <h1 className="text-4xl font-bold mb-6">Create New Movie</h1>

      {success && <div className="text-green-500 mb-4">Movie created successfully!</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="title" className="block mb-2">Title</label>
        <input
          type="text"
          id="title"
          value={movie.title}
          onChange={(e) => setMovie({ ...movie, title: e.target.value })}
          className="w-full p-3 mb-4 border rounded"
        />

        <label htmlFor="genre" className="block mb-2">Genre</label>
        <select
          id="genre"
          value={movie.genre}
          onChange={(e) => setMovie({ ...movie, genre: e.target.value })}
          className="w-full p-3 mb-4 border rounded"
        >
          <option value="">Select Genre</option>
          {genres.length > 0 ? (
            genres.map((genre, index) => (
              <option key={index} value={genre}>{genre}</option>
            ))
          ) : (
            <option value="">Loading genres...</option>
          )}
        </select>

        <label htmlFor="duration" className="block mb-2">Duration (in minutes)</label>
        <input
          type="number"
          id="duration"
          value={movie.duration}
          onChange={(e) => setMovie({ ...movie, duration: e.target.value })}
          className="w-full p-3 mb-4 border rounded"
        />

        <label htmlFor="rating" className="block mb-2">Rating</label>
        <input
          type="number"
          id="rating"
          value={movie.rating}
          onChange={(e) => setMovie({ ...movie, rating: e.target.value })}
          className="w-full p-3 mb-4 border rounded"
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Creating...' : 'Create Movie'}
        </button>
      </form>
    </div>
  );
};

export default CreateMoviePage;
