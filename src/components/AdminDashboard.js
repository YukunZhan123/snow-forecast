import React, { useState, useEffect } from 'react';
import AddResort from './AddResort';
import ResortList from './ResortList';
import { getAllResorts } from '../services/apiService'; // Ensure this function is implemented correctly

const AdminDashboard = () => {
  const [resorts, setResorts] = useState([]);

  // Function to fetch resorts
  const fetchResorts = async () => {
    try {
      const fetchedResorts = await getAllResorts();
      setResorts(fetchedResorts);
    } catch (error) {
      console.error('Error fetching resorts:', error);
    }
  };

  useEffect(() => {
    // Define the async function inside the effect
    const fetchData = async () => {
      try {
        const fetchedResorts = await getAllResorts();
        setResorts(fetchedResorts);
      } catch (error) {
        console.error('Error fetching resorts:', error);
      }
    };
  
    // Call the async function
    fetchData();
  }, []); // The empty dependency array ensures this effect runs only once after mount
  

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Pass fetchResorts to AddResort to call after a resort is added successfully */}
      <AddResort onResortAdded={fetchResorts} />
      {/* Pass the resorts list to ResortList for rendering */}
      <ResortList resorts={resorts} onResortDeleted={fetchResorts}/>
    </div>
  );
};

export default AdminDashboard;
