// components/MovieCard.js
import Link from 'next/link';
import React from 'react';

const MovieCard = ({ movie }) => {
  return (
    <div className="border p-4 rounded">
      <Link href={`/movies/${movie.movie_id}`}>
        <h2 className="text-lg cursor-pointer">{movie.title}</h2>
      </Link>
      <p>Duration: {movie.duration} mins</p>
      <p>Genre: {movie.genre}</p>
      <p>Rating: {movie.rating}/10</p>
    </div>
  );
};

export default MovieCard;
