const express = require('express');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const { Op } = require('sequelize');



const app = express();

const sequelize = require('./db');
const { Message, Conversation, Listing } = require('./models'); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'couglist-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));


const conversationsRouter = require('./routes/api/conversations');
const apiMessagesRouter = require('./routes/api/messages');
const inboxRouter = require('./routes/api/inbox');
const browseRouter = require('./routes/api/browse');
const listingRoutes = require('./routes/api/listings-details');




app.use('/conversations', conversationsRouter);
app.use('/api/messages', apiMessagesRouter);
app.use('/inbox', inboxRouter);
app.use('/browse', browseRouter);
app.use('/listing', listingRoutes);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use((err, req, res, next) => {
  console.error(err); 
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});


sequelize.sync().then(() => {
  console.log("Database synced.");
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});