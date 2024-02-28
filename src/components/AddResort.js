import React, { useState } from 'react';
import { addNewResort } from '../services/apiService'; // Ensure you have this function implemented

const AddResort = ({onResortAdded}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addNewResort({ name, location, lat, lon });
      onResortAdded();
      alert('Resort added successfully!');
      // Clear form fields after successful submission
      setName('');
      setLocation('');
      setLat('');
      setLon('');
    } catch (err) {
      setError(err.message || 'Error adding resort');
    }
  };

  return (
    <div>
      <h2>Add New Resort</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Resort Name"
          required
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          required
        />
        <input
          type="number"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="Latitude"
          required
        />
        <input
          type="number"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
          placeholder="Longitude"
          required
        />
        <button type="submit">Add Resort</button>
      </form>
    </div>
  );
};

export default AddResort;
