// src/app/movies/page.js
import Link from 'next/link';
import { fetchApi } from '../helpers';

const MoviesPage = async () => {
    try {
        const movies = await fetchApi({ route: '/movies/' });

        return (
            <div className="p-5 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4 text-black">Movie List</h1>
                <ul className="space-y-4">
                    {movies.map(movie => (
                        <li key={movie.movie_id} className="border p-4 bg-white shadow rounded">
                            <h2 className="text-xl text-black">
                                <Link href={`/movies/${movie.movie_id}`}>{movie.title}</Link>
                            </h2>                            
                            <p className="text-black">Genre: {movie.genre}</p>
                            <p className="text-black">Duration: {movie.duration} minutes</p>
                            <p className="text-black">Rating: {movie.rating}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    } catch (error) {
        console.error('Error fetching movies:', error);
        return <div className="text-black">Error loading movies.</div>;
    }
};

export default MoviesPage;
