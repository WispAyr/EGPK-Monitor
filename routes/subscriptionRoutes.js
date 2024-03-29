const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('./middleware/authMiddleware');

// Route to upgrade subscription
router.post('/upgrade', isAuthenticated, async (req, res) => {
  const { newSubscriptionType } = req.body;
  if (!['Basic', 'Enhanced'].includes(newSubscriptionType)) {
    console.log('Invalid subscription type attempted:', newSubscriptionType);
    return res.status(400).send('Invalid subscription type.');
  }
  try {
    await User.findByIdAndUpdate(req.session.userId, { subscriptionType: newSubscriptionType });
    req.session.subscriptionType = newSubscriptionType; // Update session
    console.log(`Subscription upgraded successfully for user ID: ${req.session.userId} to ${newSubscriptionType}`);
    res.send('Subscription upgraded successfully.');
  } catch (error) {
    console.error('Error upgrading subscription:', error.message, error.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Route to downgrade subscription
router.post('/downgrade', isAuthenticated, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.session.userId, { subscriptionType: 'Free' });
    req.session.subscriptionType = 'Free'; // Update session
    console.log(`Subscription downgraded successfully for user ID: ${req.session.userId}`);
    res.send('Subscription downgraded successfully.');
  } catch (error) {
    console.error('Error downgrading subscription:', error.message, error.stack);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;