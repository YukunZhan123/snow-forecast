const express = require('express');
const redisClient = require('../utils/redisClient');
const router = express.Router();
const User = require('../models/User');
const Resort = require('../models/Resort');
const isAuthenticated = require('../middleware/verifyToken'); // Path may vary

// Add a Resort to the User's Monitored List
router.post('/:userId/monitor-resort/:resortId', isAuthenticated, async (req, res) => {
    const { userId, resortId } = req.params;
  
    try {
      const user = await User.findById(userId);
      const resort = await Resort.findById(resortId);
  
      if (!resort) {
        return res.status(404).send('Resort not found');
      }
  
      // Avoid duplicating the resort in the monitored list
      if (!user.monitoredResorts.includes(resort._id)) {
        user.monitoredResorts.push(resort._id);
        await user.save();
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send('Error monitoring resort');
    }
  });

// List Monitored Resorts for a User
router.get('/:userId/monitored-resorts', isAuthenticated, async (req, res) => {
    const { userId } = req.params;
  
    try {
        // Check cache first
        const cachedResorts = await redisClient.get(`monitoredResorts:${userId}`);
        if (cachedResorts) {
          return res.status(200).json(JSON.parse(cachedResorts));
        }
    
        // If not cached, query DB
        const user = await User.findById(userId).populate('monitoredResorts');
        // Cache the result
        await redisClient.set(`monitoredResorts:${userId}`, JSON.stringify(user.monitoredResorts), {
          EX: 3600, // Cache expiration in seconds
        });
        res.status(200).json(user.monitoredResorts);
      } catch (error) {
        res.status(500).send('Error fetching monitored resorts');
      }
    });

  router.delete('/:userId/unmonitor-resort/:resortId', isAuthenticated, async (req, res) => {
    const { userId, resortId } = req.params;
  
    try {
      const user = await User.findById(userId);
  
      // Remove the resort from the user's monitored list
      user.monitoredResorts = user.monitoredResorts.filter(id => id.toString() !== resortId);
      await user.save();

      // Invalidate the cache for this user's monitored resorts
      await redisClient.del(`monitoredResorts:${userId}`);

      res.status(200).send('Resort unmonitored successfully');
    } catch (error) {
      res.status(500).send('Error unmonitoring resort');
    }
});
module.exports = router;