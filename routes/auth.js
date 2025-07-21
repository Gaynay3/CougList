const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database');
const router = express.Router();

router.post('/register', async (req, res) => {
    const email = req.body.email.trim().toLowerCase();
    const plainPassword = req.body.password;
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    db.run(
    `INSERT INTO users (email, password) VALUES (?, ?)`,
    [email, hashedPassword],
    function (err) {
        if (err) {
        console.error(err.message);
        return res.status(400).send('User already exists or invalid input');
        }
        res.redirect('/login');
    }
    );
});

router.post('/login', (req, res) => {
    const email = req.body.email.trim().toLowerCase();
    const inputPassword = req.body.password;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err || !user) {
        return res.status(400).send('Invalid credentials');
    }

    const match = await bcrypt.compare(inputPassword, user.password);
        if (!match) {
      return res.status(400).send('Invalid credentials');
    }

    req.session.userId = user.id;
    res.redirect('/dashboard');
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;