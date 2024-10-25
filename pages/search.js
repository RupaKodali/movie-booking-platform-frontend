// pages/search.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import TheaterCard from '../components/TheaterCard';

const SearchPage = () => {
  const router = useRouter();
  const { searchTerm, type } = router.query; // Get search parameters from the URL
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm && type) {
        try {
          const response = await fetch(`${process.env.BACKEND_HOST}/theaters/movies/search?searchTerm=${searchTerm}&type=${type}`);
          const data = await response.json();

          if (data.success) {
            setResults(data.results);
          } else {
            setResults([]);
          }
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }
    };

    fetchResults();
  }, [searchTerm, type]);

  return (
    <div className="search-page">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{searchTerm}"</h1>
      <div className="search-results">
        {results.length > 0 ? (
          results.map((result) => (
            <div key={result.movie_id || result.theater_id} className="result-item">
            {type === 'movies' ? (
              <Link href={`/movies/${result.movie_id}`}>{result.title}</Link>
            ) : (
              <TheaterCard theater={result} />
            )}
          </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
