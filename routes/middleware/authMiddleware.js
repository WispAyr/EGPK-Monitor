const User = require('../../models/User');

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next(); // User is authenticated, proceed to the next middleware/route handler
  } else {
    return res.redirect('/auth/login'); // User is not authenticated, redirect to login page
  }
};

const hasSubscription = (requiredTier) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.session.userId);
      if (user && ['Basic', 'Enhanced'].includes(user.subscriptionType) && requiredTier.includes(user.subscriptionType)) {
        next();
      } else {
        res.status(403).send('Insufficient subscription level.'); // Subscription level not met
      }
    } catch (error) {
      console.error('Error checking subscription tier:', error);
      res.status(500).send('Internal Server Error');
    }
  };
};

module.exports = {
  isAuthenticated,
  hasSubscription
};