const express = require('express');
const router = express.Router();
const Listing = require('../../models/listings');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/imgs/'); // folder for uploaded images
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});
const upload = multer({ storage: storage });

// POST /listings - handle form submission with image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const sellerId = req.session.userId;
    if (!sellerId) {
      return res.status(401).send('Unauthorized');
    }

    const {
      title,
      description,
      price,
      location,
      category,
      condition,
      delivery,
      dimensions
    } = req.body;

    let image = null;
    if (req.file) {
      image = req.file.filename;
    }

    await Listing.create({
      title,
      description,
      price,
      location,
      image,
      category,
      condition,
      delivery,
      dimensions,
      sellerId
    });

    
    // Or if you want to redirect:
    res.redirect('/browse');
  } catch (err) {
    console.error('Error saving listing:', err);
    res.status(500).json({ success: false, message: 'Failed to create listing' });
  }
});


module.exports = router;
