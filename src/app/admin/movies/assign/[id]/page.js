// src/app/admin/movies/assign/[id]/page.js

'use client';

import { use, useState, useEffect } from 'react';
import { fetchApi } from '@/app/helpers';
import { useRouter } from 'next/navigation';

const AssignMoviePage = ({ params }) => {
    const [theaters, setTheaters] = useState([]);
    const [screens, setScreens] = useState([]);
    const [showTime, setShowTime] = useState('');
    const [price, setPrice] = useState('0');
    const [selectedTheater, setSelectedTheater] = useState('');
    const [selectedScreen, setSelectedScreen] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const { id } = use(params);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const theatersResponse = await fetchApi({
                    route: `/theaters`,
                    method: 'GET',
                    token,
                });
                setTheaters(theatersResponse);

                // Assuming you want to fetch screens for a specific theater
                if (selectedTheater) {
                    const screensResponse = await fetchApi({
                        route: `/screens/theater/${selectedTheater}`,
                        method: 'GET',
                        token,
                    });
                    setScreens(screensResponse);
                }
            } catch (error) {
                setError('Failed to fetch data');
            }
        };
        fetchData();
    }, [router, selectedTheater]);

    const handleCreateShow = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            // Call the create show API
            const response = await fetchApi({
                route: '/shows/',
                method: 'POST',
                token,
                body: {
                    movie_id: id,
                    theater_id: selectedTheater,
                    screen_id: selectedScreen,
                    show_time: showTime,
                    price: price,
                },
            });

            // Handle success
            if (response) {
                setSuccess(true);
                setError(null);
                // Optionally redirect after success
                router.push('/admin/movies');
            }
        } catch (error) {
            setError('Failed to create show');
            setSuccess(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 text-black">
            <h1 className="text-4xl font-bold mb-6">Assign Movie to Theater and Shows</h1>
            <form onSubmit={handleCreateShow} className="space-y-6">
                <div>
                    <label htmlFor="theater" className="block text-lg font-medium mb-2">
                        Select Theater
                    </label>
                    <select
                        id="theater"
                        value={selectedTheater}
                        onChange={(e) => setSelectedTheater(e.target.value)}
                        className="w-full p-3 border rounded"
                        required
                    >
                        <option value="">Select Theater</option>
                        {theaters.map((theater) => (
                            <option key={theater.theater_id} value={theater.theater_id}>
                                {theater.theater_name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedTheater && (
                    <div>
                        <label htmlFor="screen" className="block text-lg font-medium mb-2">
                            Select Screen
                        </label>
                        <select
                            id="screen"
                            value={selectedScreen}
                            onChange={(e) => setSelectedScreen(e.target.value)}
                            className="w-full p-3 border rounded"
                            required
                        >
                            <option value="">Select Screen</option>
                            {screens.map((screen) => (
                                <option key={screen.screen_id} value={screen.screen_id}>
                                    Screen: {screen.screen_number} (Capacity: {screen.seating_capacity})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label htmlFor="showTime" className="block text-lg font-medium mb-2">
                        Show Date and Time
                    </label>
                    <input
                        type="datetime-local"
                        id="showTime"
                        value={showTime}
                        onChange={(e) => setShowTime(e.target.value)}
                        className="w-full p-3 border rounded"
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block text-lg font-medium mb-2">
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-3 border rounded"
                        required
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="mt-4">
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                    >
                        Assign Show
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push(`/admin/movies/${id}`)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            {error && <p className="text-red-500 mt-4">{error}</p>}
            {success && <p className="text-green-500 mt-4">Show created successfully!</p>}
        </div>
    );
};

export default AssignMoviePage;
