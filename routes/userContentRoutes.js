const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const User = require('../models/User');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
  }
});

const upload = multer({ storage: storage });

router.post('/upload', isAuthenticated, upload.single('content'), async (req, res) => {
  const user = req.session.userId;
  if (req.file) {
    try {
      await User.findByIdAndUpdate(user, {
        $push: { uploadedContent: { fileName: req.file.filename, filePath: req.file.path, uploadDate: new Date() } }
      });
      console.log('File uploaded and saved to user profile.');
      res.send('File uploaded and saved.');
    } catch (error) {
      console.error('Error saving file information:', error.message, error.stack);
      res.status(500).send('Error uploading file.');
    }
  } else {
    console.log('No file uploaded.');
    res.status(400).send('No file uploaded.');
  }
});

module.exports = router;