const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');  // Import Sequelize User model
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const plainPassword = req.body.password;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await User.create({ email, password: hashedPassword });

    res.redirect('/login.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const inputPassword = req.body.password;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    const match = await bcrypt.compare(inputPassword, user.password);
    if (!match) {
      return res.status(400).send('Invalid credentials');
    }

    // Save user id in session
    req.session.userId = user.id;
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

module.exports = router;
