// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const helmet = require('helmet'); // Secure Express apps by setting various HTTP headers
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require('./routes/apiRoutes'); // Added line for API routes
const userContentRoutes = require('./routes/userContentRoutes'); // Added line for user content routes
const pageRoutes = require('./routes/pageRoutes'); // Importing page routes
const subscriptionRoutes = require('./routes/subscriptionRoutes'); // Import subscription routes
const http = require('http'); // Required for Socket.IO
const { Server } = require("socket.io"); // Required for Socket.IO

if (!process.env.DATABASE_URL || !process.env.SESSION_SECRET || !process.env.MQTT_URL) {
  console.error("Error: config environment variables not set. Please create/edit .env configuration file.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet()); // Use Helmet to secure the app

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setting the templating engine to EJS
app.set("view engine", "ejs");

// Serve static files
app.use(express.static("public"));

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected successfully");
    // Start MQTT client after successful DB connection
    require('./mqttClient');
  })
  .catch((err) => {
    console.error(`Database connection error: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });

// Session configuration with connect-mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  }),
);

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected via WebSocket');

  // This is a placeholder for real-time data handling
  // You should replace this with actual ADS-B data handling
  socket.emit('aircraftPosition', { lat: 55.509865, lng: -4.611111 }); // Static data for demonstration

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Logging session creation and destruction
app.use((req, res, next) => {
  const sess = req.session;
  // Make session available to all views
  res.locals.session = sess;
  if (!sess.views) {
    sess.views = 1;
    console.log("Session created at: ", new Date().toISOString());
  } else {
    sess.views++;
    console.log(
      `Session accessed again at: ${new Date().toISOString()}, Views: ${sess.views}, User ID: ${sess.userId || '(unauthenticated)'}`,
    );
  }
  next();
});

// Authentication Routes
app.use(authRoutes);

// API Routes
app.use(apiRoutes); // Added line to use API routes

// User Content Routes
app.use('/user', userContentRoutes); // Added line to use user content routes

// Page Routes
app.use(pageRoutes); // Using page routes

// Subscription Routes
app.use(subscriptionRoutes); // Use subscription routes

// Root path response
app.get("/", (req, res) => {
  res.render("index");
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(err.status || 500).send("There was an error serving your request.");
});

// Replace app.listen with server.listen to integrate Socket.IO
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});