const express = require('express');
const axios = require('axios');
const router = express.Router();
const { isAuthenticated, hasSubscription } = require('./middleware/authMiddleware');

// Load API keys from environment variables
const weatherApiKey = process.env.WEATHER_API_KEY;
const notamsApiKey = process.env.NOTAMS_API_KEY;
const weatherApiUrl = `http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=EGPK`;
const notamsApiUrl = `https://some-notams-api.com/api/notams?api_key=${notamsApiKey}&airport=EGPK`;

// Caching setup
let weatherCache = { timestamp: 0, data: null };
let notamsCache = { timestamp: 0, data: null };
const cacheDuration = 5 * 60 * 1000; // 5 minutes

router.get('/api/weather', isAuthenticated, async (req, res) => {
  const currentTime = new Date().getTime();
  if (weatherCache.timestamp + cacheDuration > currentTime && weatherCache.data) {
    return res.json(weatherCache.data);
  }

  try {
    const response = await axios.get(weatherApiUrl);
    weatherCache = { timestamp: currentTime, data: response.data };
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error.message, error.stack);
    res.status(500).send('Failed to fetch weather data');
  }
});

router.get('/api/notams', isAuthenticated, async (req, res) => {
  const currentTime = new Date().getTime();
  if (notamsCache.timestamp + cacheDuration > currentTime && notamsCache.data) {
    return res.json(notamsCache.data);
  }

  try {
    const response = await axios.get(notamsApiUrl);
    notamsCache = { timestamp: currentTime, data: response.data };
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching NOTAMs data:', error.message, error.stack);
    res.status(500).send('Failed to fetch NOTAMs data');
  }
});

module.exports = router;