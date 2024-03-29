const express = require('express');
const router = express.Router();
const { isAuthenticated, hasSubscription } = require('./middleware/authMiddleware');
const AirportMovement = require('../models/AirportMovement');
const axios = require('axios');

router.get('/user/uploadPage', isAuthenticated, (req, res) => {
  res.render('userUpload');
});

// Adding a new route handler for the /livemap path to serve the liveMap.ejs view
router.get('/livemap', isAuthenticated, (req, res) => {
  res.render('liveMap');
});

// Route for aircraft details page, requiring at least a Basic subscription
router.get('/aircraft/:id', isAuthenticated, hasSubscription(['Basic', 'Enhanced']), async (req, res) => {
  try {
    const aircraft = await AirportMovement.findById(req.params.id);
    if (!aircraft) {
      return res.status(404).send('Aircraft not found');
    }
    res.render('aircraftDetails', { aircraft });
  } catch (error) {
    console.error('Error fetching aircraft details:', error);
    res.status(500).send('Failed to fetch aircraft details');
  }
});

// Route for weather and NOTAMs page, available for all authenticated users
router.get('/weather-notams', isAuthenticated, async (req, res) => {
  try {
    const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=EGPK`);
    const notamsResponse = await axios.get(`https://some-notams-api.com/api/notams?api_key=${process.env.NOTAMS_API_KEY}&airport=EGPK`);
    const weather = weatherResponse.data;
    const notams = notamsResponse.data;
    res.render('weatherNotams', { weather, notams });
  } catch (error) {
    console.error('Error fetching weather and NOTAMs:', error);
    res.status(500).send('Failed to fetch weather and NOTAMs');
  }
});

// Route for spotting guide page, available for all authenticated users
router.get('/spotting-guide', isAuthenticated, (req, res) => {
  res.render('spottingGuide');
});

// Route for movements log page, requiring Enhanced subscription
router.get('/movements-log', isAuthenticated, hasSubscription(['Enhanced']), async (req, res) => {
  try {
    const movements = await AirportMovement.find().sort({ createdAt: -1 }).limit(100);
    res.render('movementsLog', { movements });
  } catch (error) {
    console.error('Error fetching movements log:', error);
    res.status(500).send('Failed to fetch movements log');
  }
});

module.exports = router;