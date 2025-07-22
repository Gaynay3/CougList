const express = require('express');
const router = express.Router();
const { Listing } = require('../../models');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    const { q, category } = req.query;
    const user = req.session.userId || null;

    const whereClause = {};

    if (q) {
      const search = `%${q}%`;
      whereClause[Op.or] = [
        { title: { [Op.like]: search } },
        { description: { [Op.like]: search } }
      ];
    }

    if (category && category !== 'All') {
      whereClause.category = category;
    }

    const listings = await Listing.findAll({ where: whereClause });

    res.render('browse', { listings, query: q, category, user });
  } catch (error) {
    console.error('Browse route error:', error);
    res.status(500).send('Error loading listings');
  }
});

module.exports = router;
