// Function to fetch aircraft details by ID
function fetchAircraftDetails(aircraftId) {
  return axios.get(`/api/aircraft/${aircraftId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Fetching aircraft details failed:', error.message, error.stack);
    });
}

// Function to fetch current weather conditions
function fetchWeather() {
  return axios.get('/api/weather')
    .then(response => response.data)
    .catch(error => {
      console.error('Fetching weather data failed:', error.message, error.stack);
    });
}

// Function to fetch NOTAMs
function fetchNotams() {
  return axios.get('/api/notams')
    .then(response => response.data)
    .catch(error => {
      console.error('Fetching NOTAMs failed:', error.message, error.stack);
    });
}

// Function to fetch user-generated content
function fetchUserContent(userId) {
  return axios.get(`/api/user-content/${userId}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Fetching user content failed:', error.message, error.stack);
    });
}