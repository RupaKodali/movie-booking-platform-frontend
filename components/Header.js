// components/Header.js
import Link from 'next/link';
import Search from './Search'; 

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/movies" className="text-xl font-bold">Movie Booking Platform</Link>
      <Search /> {/* Include the Search component here */}
      <nav className="flex space-x-4">
        <Link href="/movies">Home</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </nav>
    </header>
  );
};

export default Header;
