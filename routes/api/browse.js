const express = require('express');
const router = express.Router();
const {Listing} = require('../../models');
const { Op } = require('sequelize');


router.get('/', async (req, res) => {
  console.log('QUERY:', req.query); 

  const { q, category } = req.query;
  let listings = await Listing.findAll();

  if (q) {
    const lower = q.toLowerCase();
    listings = listings.filter(l =>
      l.title.toLowerCase().includes(lower) ||
      l.description.toLowerCase().includes(lower)
    );
  }

  if (category && category !== 'All') {
    listings = listings.filter(l =>
      l.category && l.category.toLowerCase() === category.toLowerCase()
    );
  }

  res.render('browse', { listings, query: q, category });
  console.log('FILTERED LISTINGS COUNT:', listings.length);

});

module.exports = router;