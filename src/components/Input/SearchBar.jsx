import React, { useState, useEffect } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { MdClose } from 'react-icons/md';

const SearchBar = ({ value, onChange, onClearSearch, handleSearch }) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Debounce function to handle search input delay
  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(debouncedValue);
    }, 500);  // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedValue, handleSearch]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    onChange(e);
    setDebouncedValue(e.target.value);
  };

  return (
    <div className="w-full max-w-[400px] ml-10 flex items-center px-4 py-2 bg-cyan-50 rounded-lg shadow-md focus-within:shadow-lg transition-all duration-200 ease-in-out">
      <input
        type="text"
        aria-label="Search Stories"
        placeholder="Search Stories"
        className="w-full text-sm bg-transparent py-2 px-4 outline-none focus:outline-none"
        value={value}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />

      {value && (
        <MdClose
          className="text-xl text-slate-500 cursor-pointer hover:text-black mr-2 transition duration-150 ease-in-out"
          onClick={onClearSearch}
          aria-label="Clear Search"
        />
      )}

      <FaMagnifyingGlass
        className="text-slate-400 cursor-pointer hover:text-black transition duration-150 ease-in-out"
        onClick={handleSearch}
        aria-label="Search"
      />
    </div>
  );
};

export default SearchBar;
