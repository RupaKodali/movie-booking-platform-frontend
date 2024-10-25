// pages/movies.js

import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';

const Movies = () => {
    // Example movie data (you can replace this with actual API data later)
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const fetchMovies = async () => {
          try {
            const response = await fetch(`${process.env.BACKEND_HOST}:8000/movies`); // Adjust the URL to match your backend route
            console.log(response)
            const data = await response.json();
            setMovies(data);  // Set the fetched movies into state
          } catch (error) {
            console.error('Error fetching movies:', error);
          } finally {
            setLoading(false);  // Stop the loading spinner
          }
        };

        fetchMovies(); 
    }, []); 
    if (loading) {
      return <p>Loading...</p>;
    }
    return (
        <div className="grid grid-cols-3 gap-4">
          {movies.length > 0 ? (
            movies.map((movie) => <MovieCard key={movie.movie_id} movie={movie} />)
          ) : (
            <p>No movies available</p>
          )}
        </div>
      );
    };

// Ensure that you export the component as default
export default Movies;
