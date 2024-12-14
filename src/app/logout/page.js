'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Logout = () => {
    const router = useRouter();

    useEffect(() => {
        // Remove token from localStorage or cookie
        localStorage.removeItem('token');
        
        // Redirect to the login page
        router.push('/login');
    }, [router]);

    return <div>Logging out...</div>;
};

export default Logout;
