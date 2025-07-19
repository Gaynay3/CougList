const express = require('express');
const router = express.Router();
const Listing  = require('../../models');

router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) return res.status(404).send('Listing not found');

    res.render('listings-details', { listing });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;