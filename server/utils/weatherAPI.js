const axios = require('axios');

const API_KEY = '9ae5f3e17e310b3989b5f72dc8d7c262';
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

const fetchWeather = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    return response.data; // Adapt this based on the structure of the response
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

module.exports = { fetchWeather };
