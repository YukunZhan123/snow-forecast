// ResortItem.js
import React, { useState } from 'react';
import './ResortItem.css'; // Ensure styles are updated as per previous instructions

const formatDate = (dt) => {
  // Utility function to format date from timestamp
  return new Date(dt).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
};

const ResortItem = ({ resort }) => {
  const [showDetails, setShowDetails] = useState(false);

  const currentWeather = resort.weather.current;
  const dailyForecast = resort.weather.daily.slice(0, 5); // Limit to 5 days for simplicity

  return (
    <div className="resort-item" onClick={() => setShowDetails(!showDetails)}>
      <div className="resort-summary">
        <h3>{resort.name}</h3>
        {currentWeather && (
          <p>Current: {currentWeather.temp}°C, {currentWeather.weather[0].main}</p>
        )}
      </div>
      {showDetails && (
        <div className="forecast">
          {dailyForecast.map((day) => (
            <div className="forecast-item" key={day.dt}>
              <p>{formatDate(day.dt)}</p>
              <p>Temp: {day.temp.day}°C</p>
              <p>{day.weather[0].main}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResortItem;
