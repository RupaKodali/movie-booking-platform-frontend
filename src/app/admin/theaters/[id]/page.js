'use client';

import { use, useEffect, useState } from 'react';
import { fetchApi } from '@/app/helpers';
import { useRouter } from 'next/navigation';

const TheaterDetailPage = ({ params }) => {
    const { id } = use(params);
    const [theaterData, setTheaterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditingTheater, setIsEditingTheater] = useState(false);
    const [editTheaterData, setEditTheaterData] = useState({});
    const router = useRouter();
    const fetchTheaterData = async () => {
        try {
            const data = await fetchApi({ route: `/theaters/${id}/screens` });
            setTheaterData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchTheaterData();
    }, [id, router]);

    const handleTheaterEditClick = () => {
        setIsEditingTheater(true);
        setEditTheaterData({
            theater_name: theaterData.theater_name,
            location: theaterData.location,
        });
    };

    const handleTheaterFormChange = (e) => {
        const { name, value } = e.target;
        setEditTheaterData(prev => ({ ...prev, [name]: value }));
    };

    const handleTheaterFormSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await fetchApi({
                route: `/theaters/${id}`,
                method: 'PUT',
                token,
                body: editTheaterData,
            });
            const updatedData = await fetchApi({ route: `/theaters/${id}/screens` });
            setTheaterData(updatedData);
            setIsEditingTheater(false);
        } catch (error) {
            alert('Failed to update theater: ' + error.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!theaterData) return <div>No theater data found</div>;

    return (
        <div className="p-5 bg-gray-100 min-h-screen text-black">
            <div className="max-w-4xl mx-auto">
                {/* Theater Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Theater Details</h2>
                        {!isEditingTheater && (
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={handleTheaterEditClick}
                            >
                                Edit Theater
                            </button>
                        )}
                    </div>
                    {isEditingTheater ? (
                        <form onSubmit={handleTheaterFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Theater Name</label>
                                <input
                                    type="text"
                                    name="theater_name"
                                    value={editTheaterData.theater_name}
                                    onChange={handleTheaterFormChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={editTheaterData.location}
                                    onChange={handleTheaterFormChange}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditingTheater(false)}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-gray-600">Theater Name</p>
                                <p className="font-semibold">{theaterData.theater_name}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-gray-600">Location</p>
                                <p className="font-semibold">{theaterData.location}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-gray-600">Total Screens</p>
                                <p className="font-semibold">{theaterData.screen_count}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Screens Section */}
                <ScreenList 
                    theaterId={id} 
                    screens={theaterData.Screens || []} 
                    onScreensUpdate={fetchTheaterData} 
                />
            </div>
        </div>
    );
};

const ScreenList = ({ theaterId, screens, onScreensUpdate }) => {
    const [editingScreenId, setEditingScreenId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [isAddingScreen, setIsAddingScreen] = useState(false);
    const [newScreenData, setNewScreenData] = useState({
        screen_number: '',
        seating_capacity: ''
    });

    const handleEditClick = (screen) => {
        setEditingScreenId(screen.screen_id);
        setEditFormData({
            screen_number: screen.screen_number,
            seating_capacity: screen.seating_capacity
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditFormSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await fetchApi({
                route: `/screens/${editingScreenId}`,
                method: 'PUT',
                token,
                body: editFormData,
            });
            setEditingScreenId(null);
            onScreensUpdate(); // Refresh parent data
        } catch (error) {
            alert('Failed to update screen: ' + error.message);
        }
    };

    const handleNewScreenChange = (e) => {
        const { name, value } = e.target;
        setNewScreenData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddScreenToggle = () => {
        setIsAddingScreen(!isAddingScreen);
        setNewScreenData({ screen_number: '', seating_capacity: '' });
    };

    const handleNewScreenSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            newScreenData.theater_id=theaterId
            await fetchApi({
                route: `/screens/`,
                method: 'POST',
                token,
                body: newScreenData,
            });
            setIsAddingScreen(false);
            setNewScreenData({ screen_number: '', seating_capacity: '' });
            onScreensUpdate(); 
        } catch (error) {
            alert('Failed to add screen: ' + error.message);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Screens</h3>
                <button
                    className={`${isAddingScreen ? 'bg-red-500' : 'bg-green-500'} 
                        text-white px-4 py-2 rounded hover:opacity-90`}
                    onClick={handleAddScreenToggle}
                >
                    {isAddingScreen ? 'Cancel' : 'Add New Screen'}
                </button>
            </div>

            {isAddingScreen && (
                <form onSubmit={handleNewScreenSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Screen Number</label>
                        <input
                            type="number"
                            name="screen_number"
                            value={newScreenData.screen_number}
                            onChange={handleNewScreenChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Seating Capacity</label>
                        <input
                            type="number"
                            name="seating_capacity"
                            value={newScreenData.seating_capacity}
                            onChange={handleNewScreenChange}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add Screen
                    </button>
                </form>
            )}

            <div className="space-y-4">
                {screens && screens.length > 0 ? (
                    screens.map((screen) => (
                        <div key={screen.screen_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-lg font-medium">Screen {screen.screen_number}</h4>
                                    <p className="text-gray-600">Capacity: {screen.seating_capacity} seats</p>
                                </div>
                                <div className="space-x-2">
                                    <button
                                        className="bg-gray-100 text-gray-600 px-3 py-1 rounded hover:bg-gray-200"
                                        onClick={() => handleEditClick(screen)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>

                            {editingScreenId === screen.screen_id && (
                                <form onSubmit={handleEditFormSubmit} className="mt-4 bg-gray-50 p-4 rounded-lg">
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium mb-1">Screen Number</label>
                                        <input
                                            type="number"
                                            name="screen_number"
                                            value={editFormData.screen_number}
                                            onChange={handleEditFormChange}
                                            className="w-full border rounded p-2"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium mb-1">Seating Capacity</label>
                                        <input
                                            type="number"
                                            name="seating_capacity"
                                            value={editFormData.seating_capacity}
                                            onChange={handleEditFormChange}
                                            className="w-full border rounded p-2"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingScreenId(null)}
                                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 mb-4">No screens available for this theater</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TheaterDetailPage;