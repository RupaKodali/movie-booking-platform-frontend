// src/app/admin/theaters/create/page.js
'use client'

import { useState, useEffect } from 'react';
import { fetchApi } from '@/app/helpers';
import { useRouter } from 'next/navigation';

const CreateTheaterPage = () => {
    const router = useRouter();

    const [theater, setTheater] = useState({
        theater_name: '',
        location: ''
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Check if the user is authenticated when the page mounts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login'); // Redirect to login if no token is found
        }
    }, [router]); // Empty dependency array makes it run once on mount

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!theater.theater_name || !theater.location) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);  // Start loading

        try {
            const token = localStorage.getItem('token');
            const response = await fetchApi({
                route: '/theaters/',
                method: 'POST',
                token,
                body: {
                    theater_name: theater.theater_name,
                    location: theater.location
                }
            });

            setSuccess(true);
            setTheater({ theater_name: '', location: '' });
            setError(null);
            setLoading(false);

            // Optionally redirect after success
            router.push('/admin/theaters'); // Redirect to movie list page after success
        } catch (err) {
            setError(err.message);
            setSuccess(false);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 text-black">
            <h1 className="text-4xl font-bold mb-6">Create New Theater</h1>

            {success && <div className="text-green-500 mb-4">Theater created successfully!</div>}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="theater_name" className="block mb-2">Theater Name</label>
                <input
                    type="text"
                    id="theater_name"
                    value={theater.theater_name}
                    onChange={(e) => setTheater({ ...theater, theater_name: e.target.value })}
                    className="w-full p-3 mb-4 border rounded"
                />

                <label htmlFor="location" className="block mb-2">Location</label>
                <input
                    type="text"
                    id="location"
                    value={theater.location}
                    onChange={(e) => setTheater({ ...theater, location: e.target.value })}
                    className="w-full p-3 mb-4 border rounded"
                />


                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Theater'}
                </button>
            </form>
        </div>
    );
};

export default CreateTheaterPage;
