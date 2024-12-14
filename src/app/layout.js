'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('movies');
  const [token, setToken] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin
  const router = useRouter();

  useEffect(() => {
    const userRole = localStorage.getItem('user'); // Check user role
    setToken(localStorage.getItem('token'));
    setIsAdmin(userRole === 'ADMIN'); // Set isAdmin to true if user is ADMIN
  }, []);

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    {
      isAdmin ? (
        router.push(`/admin/search?term=${encodeURIComponent(searchTerm)}&type=${encodeURIComponent(searchType)}`)
      ) : (
        router.push(`/search?term=${encodeURIComponent(searchTerm)}&type=${encodeURIComponent(searchType)}`)

      )
    }
    };
    const handleProfileClick = () => {
      setShowDropdown((prev) => !prev);
    };

    const handleLogout = () => {
      localStorage.removeItem('token'); // Clear token
      localStorage.removeItem('user'); // Clear user role
      setShowDropdown(false); // Close dropdown
      setToken(false);
      alert('Logged out successfully');
      router.push('/login'); // Redirect to login page
    };

    return (
      <html lang="en">
        <body className="bg-gray-100 font-sans flex flex-col min-h-screen">
          <header className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto flex justify-between items-center">
              {isAdmin ? (
                <h1 className="text-2xl font-bold">
                  <Link href="/admin/" className="cursor-pointer">Movie Booking Platform</Link>
                </h1>
              ) : (<h1 className="text-2xl font-bold">
                <Link href="/" className="cursor-pointer">Movie Booking Platform</Link>
              </h1>)
              }
              {/* Search Bar */}
              <div className="flex items-center space-x-4">
                <form onSubmit={handleSearchSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchInput}
                    placeholder="Search movies or theaters"
                    className="p-2 rounded text-black"
                  />
                  <select
                    value={searchType}
                    onChange={handleSearchTypeChange}
                    className="p-2 rounded text-black"
                  >
                    <option value="movies">Movies</option>
                    <option value="theaters">Theaters</option>
                  </select>
                  <button type="submit" className="bg-blue-600 text-white p-2 rounded">Search</button>
                </form>
              </div>

              {/* Navigation Links */}
              <ul className="flex space-x-4 items-center">
                {isAdmin ? (
                  <>
                    {/* Admin-Specific Navigation */}
                    <li><Link href="/admin/movies" className="hover:no-underline cursor-pointer">Movies</Link></li>
                    <li><Link href="/admin/theaters" className="hover:no-underline cursor-pointer">Theaters</Link></li>
                    <li><Link href="/admin/bookings" className="hover:no-underline cursor-pointer">Bookings</Link></li>
                    <li><Link href="/admin/users" className="hover:no-underline cursor-pointer">Users</Link></li>
                  </>
                ) : (
                  <>
                    {/* User-Specific Navigation */}
                    <li><Link href="/movies" className="hover:no-underline cursor-pointer">Movies</Link></li>
                    <li><Link href="/theaters" className="hover:no-underline cursor-pointer">Theaters</Link></li>
                    <li><Link href="/bookings" className="hover:no-underline cursor-pointer">Bookings</Link></li>
                  </>
                )}

                {token ? (
                  <li className="relative">
                    <button onClick={handleProfileClick} className="text-2xl focus:outline-none">👤</button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded">
                        <ul className="py-2">
                          <li>
                            <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 text-black">
                              Profile
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={handleLogout}
                              className="block px-4 py-2 w-full text-left hover:bg-gray-100 text-black"
                            >
                              Logout
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                ) : (
                  <li><Link href="/login" className="hover:no-underline cursor-pointer">Login</Link></li>
                )}
              </ul>
            </nav>
          </header>

          {/* Main Content */}
          <main className="container mx-auto p-4 flex-grow">{children}</main>

          <footer className="bg-gray-800 text-white text-center p-4">
            <p>&copy; 2024 Movie Booking Platform</p>
          </footer>
        </body>
      </html>
    );
  }
