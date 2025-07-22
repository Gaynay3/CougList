const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

const sequelize = require('./db');
const { Message, Conversation, Listing } = require('./models'); 

const authRoutes = require('./routes/auth');
const requireLogin = require('./middleware/auth');

const conversationsRouter = require('./routes/api/conversations');
const apiMessagesRouter = require('./routes/api/messages');
const inboxRouter = require('./routes/api/inbox');
const browseRouter = require('./routes/api/browse');
const listingDetailsRouter = require('./routes/api/listing-details');
const dashboardRouter = require('./routes/api/dashboard');
const listingsRouter = require('./routes/api/listings');

const app = express();
const PORT = 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'couglist-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

// Routes
app.use(authRoutes);
app.use('/conversations', conversationsRouter);
app.use('/api/messages', apiMessagesRouter);
app.use('/inbox', inboxRouter);
app.use('/browse', browseRouter);
app.use('/listing', listingDetailsRouter); 
app.use('/dashboard', dashboardRouter);
app.use('/listings', listingsRouter);


// Rendered pages
app.get('/', (req, res) => {
  res.render('landing-page', { user: req.session.userId });
});

app.get('/browse', (req, res) => {
  res.render('browse', { user: req.session.userId });
});

// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err); 
  res.status(err.status || 500).json({ error: err.message || 'Server Error' });
});

// Sync DB and start server
sequelize.sync().then(() => {
  console.log("Database synced.");
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
