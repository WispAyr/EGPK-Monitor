# EGPK_Overwatch

EGPK_Overwatch is a comprehensive application designed to enhance the experience of aircraft spotters at EGPK Airport (Prestwick Airport) in Scotland. It provides real-time information on aircraft movements, weather updates, NOTAMs, and spotting locations, all through a clean and engaging user interface. The app includes various subscription tiers, including a Free trial, Basic, and Enhanced options, catering to different user needs.

## Overview

The application is built using the Node.js platform with the Express framework for the backend, and EJS view engine along with Bootstrap for the frontend styling. MongoDB is utilized for data management, with Mongoose ORM for database operations. Real-time aircraft positions are displayed using ADS-B radar data integrated via MQTT protocol. The architecture is designed to handle user authentication, subscription management, and real-time data processing, ensuring a seamless user experience.

## Features

- **Live Map Integration:** Showcasing real-time aircraft positions with ADS-B radar data.
- **Database of Airport Movements:** Detailed information on aircraft movements at EGPK Airport.
- **User-Generated Content:** Allows users to upload photos and videos of aircraft.
- **Weather and NOTAMs Information:** Provides current weather conditions and relevant NOTAMs at EGPK.
- **Spotting Information:** Offers tips and locations for aircraft spotting.
- **Movements Log:** Logs of daily, monthly, and yearly airport movements, with enhanced features for subscribers.
- **Subscription Tiers:** Options for Free trial, Basic, and Enhanced access to features.

## Getting started

### Requirements

- Node.js
- MongoDB
- MQTT broker URL for ADS-B data

### Quickstart

1. Clone the repository to your local machine.
2. Copy `.env.example` to `.env` and fill in the necessary environment variables.
3. Install dependencies with `npm install`.
4. Run the application with `npm start`.

### License

Copyright (c) 2024.