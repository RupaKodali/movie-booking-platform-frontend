// src/app/movies/[id]/page.js
'use client'

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/app/helpers';
import Link from 'next/link';

const MovieDetailPage = ({ params }) => {
    const { id } = use(params);
    const [movieData, setMovieData] = useState(null);
    const [editingMovieId, setEditingMovieId] = useState(null); // Track editing state
    const [editedMovie, setEditedMovie] = useState(null); // Store editable movie  
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0] // Set default to current date
    );    
    const [filteredTheaters, setFilteredTheaters] = useState([]); // Track filtered theaters
    const router = useRouter();

    async function fetchMovieData(date) {
        try {
            const data = await fetchApi({ route: `/theaters/movies/${id}?date=${date}` });
            setMovieData(data);
            setFilteredTheaters(data.Theaters); // Initialize with all theaters
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login'); // Redirect to login page
        }

        async function fetchGenres() {
            const genresResponse = await fetchApi({
                route: '/movies/genres',
                method: 'GET',
                token,
            });
            setGenres(genresResponse.genres || []);
        }
        fetchMovieData(selectedDate);
        fetchGenres();
    }, [id]);

    const handleDateFilter = (date) => {
        console.log(date)
        setSelectedDate(date);

        if (date) {
            fetchMovieData(date)
        } else {
            setFilteredTheaters(movieData.Theaters); // Reset to all theaters if no date is selected
        }
    };

    const handleEditClick = (movie) => {
        setEditingMovieId(movie.movie_id);
        setEditedMovie({ ...movie }); // Pre-fill form with movie data
    };

    const handleCancelEdit = () => {
        setEditingMovieId(null);
        setEditedMovie(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedMovie((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleUpdateMovie = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            let res = await fetchApi({
                route: `/movies/${editingMovieId}`,
                method: 'POST',
                token,
                body: {
                    title: editedMovie.title,
                    genre: editedMovie.genre,
                    duration: parseInt(editedMovie.duration, 10),
                    rating: parseFloat(editedMovie.rating),
                },
            });
            setSuccess(true);
            handleCancelEdit();
            await fetchMovieData();
        } catch (error) {
            setError('Failed to update the movie');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-5 bg-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-black">{movieData.title}</h1>
                <Link
                    href={`/admin/movies/assign/${movieData.movie_id}`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded mt-4 inline-block"
                >
                    Assign Movie to Theater and Shows
                </Link>
            </div>
            <div className="mt-4 text-black">
                {editingMovieId === movieData.movie_id ? (
                    <form onSubmit={handleUpdateMovie}>
                        <label htmlFor="title" className="block mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={editedMovie.title}
                            onChange={handleInputChange}
                            className="w-full p-3 mb-4 border rounded"
                        />
                        <label htmlFor="genre" className="block mb-2">
                            Genre
                        </label>
                        <select
                            name="genre"
                            value={editedMovie.genre}
                            onChange={handleInputChange}
                            className="w-full p-3 mb-4 border rounded"
                        >
                            <option value="">Select Genre</option>
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>
                                    {genre}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="duration" className="block mb-2">
                            Duration (minutes)
                        </label>
                        <input
                            type="number"
                            name="duration"
                            value={editedMovie.duration}
                            onChange={handleInputChange}
                            className="w-full p-3 mb-4 border rounded"
                        />
                        <label htmlFor="rating" className="block mb-2">
                            Rating
                        </label>
                        <input
                            type="number"
                            name="rating"
                            value={editedMovie.rating}
                            onChange={handleInputChange}
                            className="w-full p-3 mb-4 border rounded"
                            step="0.1"
                            max="5"
                        />
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <>
                        <p>
                            <strong>Genre:</strong> {movieData.genre}
                        </p>
                        <p>
                            <strong>Duration:</strong> {movieData.duration} minutes
                        </p>
                        <p>
                            <strong>Rating:</strong> {movieData.rating}
                        </p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent parent click
                                handleEditClick(movieData);
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                        >
                            Edit
                        </button>
                    </>
                )}
                {/* Date Filter */}
                <div className="mb-4">
                    <label htmlFor="filterDate" className="mr-2 font-bold">
                        Filter by Date:
                    </label>
                    <input
                        type="date"
                        id="filterDate"
                        value={selectedDate}
                        onChange={(e) => handleDateFilter(e.target.value)}
                        className="border px-2 py-1 rounded"
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>
            <h2 className="text-xl font-semibold text-black mt-6">Theaters Showing This Movie:</h2>
            <ul className="space-y-4">
                {filteredTheaters.map(theater => (
                    <li key={theater.theater_id} className="border p-4 bg-white shadow rounded">
                        <h3 className="text-lg text-black">{theater.theater_name}</h3>
                        <p className="text-black">Location: {theater.location}</p>

                        <h4 className="text-md font-semibold text-black mt-4">Shows:</h4>
                        <ShowList shows={theater.Shows}
                        />
                    </li>
                ))}
            </ul>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">Movie updated successfully!</p>}

        </div>
    );
};

const ShowList = ({ shows }) => {
    const [expandedShows, setExpandedShows] = useState({});

    const toggleShowDetails = (showId) => {
        setExpandedShows((prev) => ({
            ...prev,
            [showId]: !prev[showId],
        }));
    };

    return (
        <ul className="space-y-2">
            {shows.map(show => {
                const showId = show.show_id;

                return (
                    <li key={showId} className="border p-2 bg-gray-50 rounded">
                        <div onClick={() => toggleShowDetails(showId)} className="cursor-pointer">
                            <p className="text-black">Show Time: {new Date(show.show_time).toLocaleString()}</p>
                        </div>
                        {expandedShows[showId] && (
                            <div className="mt-2">
                                <p className="text-black">Price: ${(show.price).toFixed(2)}</p>
                                <p className="text-black">Seating Capacity: {show.seating_capacity}</p>
                                <p className="text-black">Screen Number: {show.Screen.screen_number}</p>
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};

export default MovieDetailPage;
