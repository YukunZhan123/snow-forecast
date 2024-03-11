const express = require('express');

const router = express.Router();
const Resort = require('../models/Resort');
const { fetchWeather } = require('../utils/weatherAPI');
const adminToken = require('../middleware/adminToken'); // Ensure you have middleware to check for admin users
const isAuthenticated = require('../middleware/verifyToken'); // Path may vary

router.post('/add', adminToken, async (req, res) => {
    try {
      const { name, location, lat, lon } = req.body;
  
      // Fetch weather data for the resort's location
      const weatherData = await fetchWeather(lat, lon);
  
      // Create a new resort with fetched weather data
      const newResort = new Resort({
        name,
        location,
        lat,
        lon,
        weather: weatherData, 
      });
  
      await newResort.save();
      res.status(201).json(newResort);
    } catch (error) {
      console.error('Failed to create resort with weather data:', error);
      res.status(500).json({ message: 'Error adding resort', error });
    }
  });

// Endpoint to search resorts by name
router.get('/search', isAuthenticated, async (req, res) => {
    const searchTerm = req.query.name;
    
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }
  
    try {
      // Use a regex for case-insensitive partial matches
      const regex = new RegExp(searchTerm, 'i');
      const resorts = await Resort.find({ name: regex });
  
      res.json(resorts);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: 'Error searching for resorts', error });
    }
  });
  
// Get all resorts
router.get('/', async (req, res) => {
    try {
      const resorts = await Resort.find({});
      res.json(resorts);
    } catch (error) {
      console.error('Failed to fetch resorts:', error);
      res.status(500).json({ message: 'Error fetching resorts' });
    }
  });
  
  // Delete a specific resort
  router.delete('/:resortId', adminToken, async (req, res) => {
    try {
      const resort = await Resort.findByIdAndDelete(req.params.resortId);
      if (!resort) {
        return res.status(404).json({ message: 'Resort not found' });
      }
      res.status(204).send(); // No Content
    } catch (error) {
      console.error('Failed to delete resort:', error);
      res.status(500).json({ message: 'Error deleting resort' });
    }
  });

module.exports = router;
