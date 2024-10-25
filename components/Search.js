// components/Search.js
import { useState } from 'react';
import { useRouter } from 'next/router';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('movies'); // Default to searching for movies
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    // Redirect to the search page with query parameters
    router.push(`/search?searchTerm=${searchTerm}&type=${searchType}`);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="flex items-center">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="movies">Movies</option>
          <option value="theaters">Theaters</option>
        </select>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Search ${searchType}...`}
          className="border rounded p-2 mx-2"
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-2">Search</button>
      </form>
    </div>
  );
};

export default Search;
