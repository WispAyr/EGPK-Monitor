const mongoose = require('mongoose');

const airportMovementSchema = new mongoose.Schema({
  aircraftType: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  parkingStand: { type: String, required: true },
  apron: { type: String, required: true }
}, { timestamps: true });

// Adding indexing to optimize database queries
airportMovementSchema.index({ aircraftType: 1, origin: 1, destination: 1 });

const AirportMovement = mongoose.model('AirportMovement', airportMovementSchema);

module.exports = AirportMovement;