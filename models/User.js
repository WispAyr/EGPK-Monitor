const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  uploadedContent: [{
    fileName: { type: String },
    filePath: { type: String },
    uploadDate: { type: Date, default: Date.now }
  }],
  subscriptionType: { type: String, enum: ['Free', 'Basic', 'Enhanced'], default: 'Free' } // Added line for subscription type
});

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return next(err);
    }
    user.password = hash;
    next();
  });
});

// Adding indexing to optimize database queries
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;