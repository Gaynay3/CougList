const express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path'); 

const authRoutes = require('./routes/auth');
const requireLogin = require('./middleware/auth');

const app = express();
const PORT = 3000;

app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'couglist-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(authRoutes);

app.get('/', (req, res) => {
  res.redirect('/landing-page.html');
});

app.get('/dashboard', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});