// src/app/search/page.js
'use client'; 

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link'; // Import Link component from next/link
import { fetchApi } from '../helpers';

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useSearchParams to get query parameters
  const searchParams = useSearchParams();
  const term = searchParams.get('term');
  const type = searchParams.get('type');

  useEffect(() => {
    if (term && type) {

      const fetchResults = async () => {
        setLoading(true);
        try {
          const data = await fetchApi({ route: `/theaters/movies/search?searchTerm=${term}&type=${type}` });
          setResults(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    }
  }, [term, type]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className="container mx-auto p-4 text-black">
      <h2 className="text-2xl mb-4">Search Results for "{term}"</h2>

      {type === 'movies' ? (
        <div className="p-5 bg-gray-100">
          <h1 className="text-2xl font-bold mb-4 text-black">Movie List</h1>
          <ul className="space-y-4">
            {results.map((movie) => (
              <li key={movie.movie_id} className="border p-4 bg-white shadow rounded">
                <h2 className="text-xl text-black">
                  {/* Movie title is now clickable */}
                  <Link href={`/movies/${movie.movie_id}`} passHref>
                    {movie.title}
                  </Link>
                </h2>
                <p className="text-black">Genre: {movie.genre}</p>
                <p className="text-black">Duration: {movie.duration} minutes</p>
                <p className="text-black">Rating: {movie.rating}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h3 className="text-xl">Theaters:</h3>
          <ul>
            {results.map((theater) => (
               <li key={theater.theater_id} className="border p-4 bg-white shadow rounded">
               <h2 className="text-xl text-black">
                 {/* Movie title is now clickable */}
                 <Link href={`/theaters/${theater.theater_id}`} passHref>
                   {theater.theater_name}
                 </Link>
               </h2>
               <p className="text-black">Location: {theater.location}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
