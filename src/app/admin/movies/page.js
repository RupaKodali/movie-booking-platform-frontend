//src/app/admin/movies/page.js
'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/app/helpers';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const moviesResponse = await fetchApi({
          route: '/movies/',
          method: 'GET',
          token,
        });
        setMovies(moviesResponse);
      } catch (error) {
        setError('Failed to fetch data');
      }
    };
    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-4xl font-bold mb-6">Movie Dashboard</h1>
        <Link
          href="/admin/movies/create"
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
        >
          Create New Movie
        </Link>
      </div>
    

      <div className="mt-6">
        {movies.length === 0 ? (
          <p className="text-gray-500">No movies available.</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Movie ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Genre</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Duration</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Rating</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.movie_id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">{movie.movie_id}</td>
                  <td className="border underline border-gray-300 px-4 py-2"><Link href={`/admin/movies/${movie.movie_id}`}>{movie.title}</Link></td>


                  <td className="border border-gray-300 px-4 py-2">{movie.genre}</td>
                  <td className="border border-gray-300 px-4 py-2">{movie.duration}</td>
                  <td className="border border-gray-300 px-4 py-2">{movie.rating}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(movie.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">Movie updated successfully!</p>}
    </div>
  );
};

export default MoviesPage;
