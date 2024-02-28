const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

// Example of a protected route
router.get('/ProtectedRoute', verifyToken, (req, res) => {
  res.send(req.user);
});

// User registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).send('User created successfully');
  } catch (err) {
    res.status(500).send('Error in saving');
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found');
    }

    // Check password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).send('Invalid password');
    }

    const userForToken = {
      _id: user._id,
      email: user.email,
    };

    // Create and assign a token
    const token = jwt.sign(userForToken, process.env.TOKEN_SECRET);
    res.json({
      token: token, // The token itself
      user: userForToken // The minimal user info
    });

  } catch (err) {
    res.status(500).send('Error in login');
  }
});

//admin login
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid password');
    }

    // Check if the user is an admin
    if (user.role !== 'admin') {
      return res.status(403).send('Access denied. Admins only.');
    }

    const adminForToken = {
      _id: user._id,
      email: user.email,
    };

    // Create and assign a token
    const token = jwt.sign(adminForToken, process.env.ADMIN);
    res.json({
      token: token, // The token itself
      admin: adminForToken // The minimal user info
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Admin registration
router.post('/admin/register', async (req, res) => {
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user with admin role
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: 'admin', // Set the role to admin
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).send('Error creating the account');
  }
});

module.exports = router;

