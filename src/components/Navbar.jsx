import React from 'react';
import ProfileInfo from './Cards/ProfileInfo';
import { Navigate, useNavigate } from 'react-router-dom';
import SearchBar from './Input/SearchBar';

const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSearchNotes,handleClearSearch }) => {
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearchNotes(searchQuery);
    } else {
      onClearSearch();
    }
  };

  const onClearSearch = () => {
    handleClearSearch();
    setSearchQuery("");
}


  return (
    <div className="bg-cyan-50 flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
      <h1 className="text-4xl font-semibold">
        <i className='font-serif'>Travel Dairies</i>
      </h1>

      {isToken && (

        <>
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => {
              const newQuery = target.value;
              setSearchQuery(newQuery);
              
              // Automatically search or fetch all stories
              if (!newQuery.trim()) {
                handleClearSearch();
              } else {
                onSearchNotes(newQuery);
              }
            }}
            handleSearch={handleSearch}
            onClearSearch={() => {
              setSearchQuery("");
              handleClearSearch();
            }}
          />
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />{""}
        </>
      )
      }
    </div>
  );
};

export default Navbar;