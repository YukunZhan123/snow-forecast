const express = require('express');
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
      const user = await User.findById(userId).populate('monitoredResorts');
      res.status(200).json(user.monitoredResorts);
    } catch (error) {
      res.status(500).send('Error fetching monitored resorts');
    }
  });

// Remove a Resort from the User's Monitored List
router.delete('/:userId/unmonitor-resort/:resortId', isAuthenticated, async (req, res) => {
    const { userId, resortId } = req.params;
  
    try {
      const user = await User.findById(userId);
  
      user.monitoredResorts = user.monitoredResorts.filter(id => id.toString() !== resortId);
      await user.save();
  
      res.status(200).send('Resort unmonitored successfully');
    } catch (error) {
      res.status(500).send('Error unmonitoring resort');
    }
  });

module.exports = router;