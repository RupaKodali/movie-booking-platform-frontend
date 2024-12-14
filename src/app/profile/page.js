// src/app/profile/page.js
'use client'; // If using client-side fetching, otherwise remove it for server-side rendering

import { useEffect, useState } from 'react';
import {fetchApi, getUserIdFromToken} from '../helpers'

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    
    const setData = async() =>{
        const userId = await getUserIdFromToken(token); 

        try {
          const data = await fetchApi({ route: `/users/${userId}`, token });
          setUserData(data);
          setLoading(false);
      } catch (error) {
        setLoading(false);
          console.error('Failed to fetch user data:', error);
      }
    }
    setData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>No user data found</p>;

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded text-black">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p><strong>Name:</strong> {userData.name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Phone:</strong> {userData.phone_number}</p>
      <p><strong>Joined:</strong> {new Date(userData.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default ProfilePage;
