const express = require('express');
const router = express.Router();
const {Listing} = require('../../models');
const { Op } = require('sequelize');


//render all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.findAll();
    res.render('browse', { listings });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).send('error loading listings');
  }
});

module.exports = router;