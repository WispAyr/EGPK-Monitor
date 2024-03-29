const mqtt = require('mqtt');
const AirportMovement = require('./models/AirportMovement');
const mongoose = require('mongoose');

const mqttUrl = 'mqtt://192.168.0.63:1883'; 
const client = mqtt.connect(mqttUrl);

client.on('connect', function () {
  console.log('MQTT Client Connected');
  client.subscribe('EGPK', function (err) {
    if (!err) {
      console.log('Subscribed to EGPK ADS-B feed');
    } else {
      console.error('Subscription error:', err);
    }
  });
});

client.on('message', function (topic, message) {
  console.log(message);
  // message is a Buffer
  try {
    const msg = JSON.parse(message.toString());
    const { aircraftType, origin, destination, parkingStand, apron } = msg; // Ensure these fields match your data structure
    if (aircraftType && origin && destination && parkingStand && apron) {
      AirportMovement.create({
        aircraftType,
        origin,
        destination,
        parkingStand,
        apron
      }).then(() => {
        console.log('Stored ADS-B movement in MongoDB');
      }).catch(err => {
        console.error('Error storing ADS-B movement:', err);
      });
    }
  } catch (err) {
    console.error('Error parsing MQTT message:', err);
  }
});

client.on('error', function (err) {
  console.error('MQTT Client Error:', err);
});

client.on('offline', function () {
  console.log('MQTT Client Offline');
});

client.on('reconnect', function () {
  console.log('MQTT Client Reconnecting...');
});

process.on('SIGINT', function () {
  client.end();
  mongoose.disconnect();
  console.log('MQTT Client Disconnected');
  process.exit(0);
});