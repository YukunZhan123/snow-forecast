import React, { useState, useEffect } from 'react';
import { searchResorts, addResortToMonitoredList, getMonitoredResorts, getAllResorts } from '../services/apiService'; // Ensure getMonitoredResorts is implemented
import './Home.css';
import ResortItem from './ResortItem';
import ResortMap from './ResortMap';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [monitoredResorts, setMonitoredResorts] = useState([]);
  const [resorts, setResorts] = useState([]); 
  const [error, setError] = useState('');
  const [showSearch, setShowSearch] = useState(false); // State to control search results display
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  const userId = JSON.parse(localStorage.getItem('user'))?._id;

  // Fetch monitored resorts on component mount
  useEffect(() => {
    const fetchMonitoredResorts = async () => {
      try {
        const resorts = await getMonitoredResorts(userId);
        setMonitoredResorts(resorts);
      } catch (err) {
        console.error('Failed to fetch monitored resorts:', err);
      }
    };

    fetchMonitoredResorts();

    const fetchAllResorts = async () => {
        const data = await getAllResorts();
        setResorts(data);
      };
  
      fetchAllResorts();

      const fetchUserLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Location fetched:', position);
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (err) => console.error(err),
          { enableHighAccuracy: true }
        );
      };
    
      fetchUserLocation();

  }, [userId]); // Dependency array to fetch resorts once on component mount

  // Function to search resorts
  const handleSearch = async () => {
    setError('');
    setShowSearch(true); // Show search results
    try {
      const data = await searchResorts(searchTerm);
      setSearchResults(data);
    } catch (err) {
      setError('Failed to fetch resorts. Please try again.');
      setSearchResults([]);
    }
  };

  // Function to add a resort to the monitored list
  const handleAddResort = async (resortId) => {
    try {
      await addResortToMonitoredList(userId, resortId);
      alert('Resort added successfully!');
      // Refresh the monitored resorts list after adding
      const updatedResorts = await getMonitoredResorts(userId);
      setMonitoredResorts(updatedResorts);
    } catch (err) {
      alert('Failed to add resort. Please try again.');
    }
  };

  // Function to hide search results
  const handleCloseSearch = () => {
    setShowSearch(false); // Hide search results
    setSearchTerm(''); // Optionally clear search term
  };

  return (
    <div className="home-container">
        <nav className="navbar">
        <ul>
          <li><a href="/">Home</a></li>
          {isLogin ? <li><a href="/login">Login</a></li> : <li><a href="/logout">Logout</a></li>}
          
          <li><a href="/register">Register</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
      <header className="home-header">
        <h1>Welcome to Snow Forecast</h1>
        <p>Explore the latest snow conditions and updates!</p>
      </header>
      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for resorts..."
        />
        <button className="search-btn" onClick={handleSearch}>Search</button>
        <button className="close-btn" onClick={handleCloseSearch}>Close Search</button>
        <button className="map-btn" onClick={() => setShowMap(!showMap)}>
            {showMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {showSearch && (
        <div className="search-results">
          {searchResults.map((resort) => (
            <div className="resort-item" key={resort._id}>
              {resort.name}
              <button className="add-btn" onClick={() => handleAddResort(resort._id)}>Add</button>
            </div>
          ))}
        </div>
      )}
      {showMap && userLocation && (
    <div>
        <h2>Resort Locations</h2>
        <ResortMap resorts={resorts} userLocation={userLocation} />
    </div>
    )}

      <section className="monitored-section">
        <h2>Your Monitored Resorts</h2>
        <div className="resorts-list">
        {monitoredResorts.map((resort) => (
          <ResortItem key={resort._id} resort={resort} />
        ))}
      </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Snow Forecast. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;