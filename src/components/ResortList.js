import React, { useEffect, useState } from 'react';
import { getAllResorts, deleteResort } from '../services/apiService'; // Define these API calls

const ResortList = ({resorts, onResortDeleted}) => {

  const handleDelete = async (resortId) => {
    await deleteResort(resortId);
    onResortDeleted();  
    alert('Resort deleted successfully!');
};
  // Implement handleEdit similar to handleDelete, but navigate to an edit form

  return (
    <div>
      <h2>Resorts List</h2>
      <ul>
        {resorts.map(resort => (
          <li key={resort._id}>
            {resort.name} - {resort.location}
            <button onClick={() => handleDelete(resort._id)}>Delete</button>
            <button onClick={() => {/* navigate to edit form */}}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResortList;
