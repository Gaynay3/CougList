const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const requireLogin = require('./middleware/auth');

const app = express();
const PORT = 3000;

// Set EJS view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'couglist-secret',
  resave: false,
  saveUninitialized: false
}));

// Routes
app.use(authRoutes);

// Home page
app.get('/', (req, res) => {
  res.render('landing-page', { user: req.session.userId });
});

// Browse Page (Rendered with user info for conditional dashboard)
app.get('/browse', (req, res) => {
  res.render('browse', { user: req.session.userId });
});

app.get('/about-us', (req, res) => {
  res.render('about-us', { user: req.session.userId });
});

// Dashboard (Protected Route)
app.get('/dashboard', requireLogin, (req, res) => {
  res.render('dashboard', { user: req.session.userId });
});

app.get('/listing', (req, res) => {
  res.render('listing', { user: req.session.userId });
});

app.get('/listing-details', (req, res) => {
  res.render('listing-details', { user: req.session.userId });
});

app.get('/product-listing', (req, res) => {
  res.render('product-listing', { user: req.session.userId });
});

app.get('/login', (req, res) => {
  res.render('login', { user: req.session.userId });
});

app.get('/register', (req, res) => {
  res.render('register', { user: req.session.userId });
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
