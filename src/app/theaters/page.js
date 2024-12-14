// src/app/movies/page.js
import Link from 'next/link';
import { fetchApi } from '../helpers';

const TheatersPage = async () => {
    try {
        const theaters = await fetchApi({ route: '/theaters/' });

        return (
            <div className="p-5 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4 text-black">Movie List</h1>
                <ul className="space-y-4">
                    {theaters.map(theater => (
                        <li key={theater.theater_id} className="border p-4 bg-white shadow rounded">
                            <h2 className="text-xl text-black">
                                <Link href={`/theaters/${theater.theater_id}`}>{theater.theater_name}</Link>
                            </h2>                            
                            <p className="text-black">Location: {theater.location}</p>
                        </li>
                    ))}
                </ul>
            </div>
        );
    } catch (error) {
        console.error('Error fetching theaters:', error);
        return <div className="text-black">Error loading theaters.</div>;
    }
};

export default TheatersPage;
