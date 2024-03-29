document.addEventListener('DOMContentLoaded', function() {
  // Initialize the map
  const map = L.map('map').setView([55.509865, -4.611111], 13); // EGPK Airport coordinates
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Connect to the server using Socket.IO
  const socket = io();

  socket.on('aircraftPosition', (position) => {
    console.log('Aircraft position received:', position);

    // Add a marker to the map for the aircraft
    L.marker([position.lat, position.lng]).addTo(map)
      .bindPopup('Aircraft')
      .openPopup();
  });

  socket.on('connect_error', (err) => {
    console.error('Socket.IO connection error:', err.message, err.stack);
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server for live aircraft positions.');
  });

  // Check if the map container is visible and properly initialized
  if (map) {
    map.invalidateSize();
    console.log('Map size invalidated and recalculated.');
  } else {
    console.error('Map initialization failed.');
  }
});