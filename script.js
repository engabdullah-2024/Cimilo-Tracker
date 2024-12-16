// OpenWeather API key
const apiKey = 'b6273be527a39c02aaa3506b4feed5cd'; // Replace with your OpenWeather API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

// Elements
const countryInput = document.getElementById('countryInput');
const searchButton = document.getElementById('searchButton');
const currentLocationButton = document.getElementById('currentLocationButton');
const weatherResult = document.getElementById('weatherResult');
const forecastResult = document.getElementById('forecastResult');
const themeToggle = document.getElementById('themeToggle');

// Toggle Dark Mode
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Fetch Current Weather
const fetchWeather = (query) => {
  fetch(`${apiUrl}?q=${query}&appid=${apiKey}&units=metric`)
    .then((response) => {
      if (!response.ok) throw new Error('City not found');
      return response.json();
    })
    .then(displayWeather)
    .catch(showError);
};

// Fetch Weather by Geolocation
const fetchWeatherByCoords = (lat, lon) => {
  fetch(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then((response) => {
      if (!response.ok) throw new Error('Could not fetch location weather');
      return response.json();
    })
    .then(displayWeather)
    .catch(showError);
};

// Fetch 5-Day Forecast
const fetchForecast = (query) => {
  fetch(`${forecastUrl}?q=${query}&appid=${apiKey}&units=metric`)
    .then((response) => {
      if (!response.ok) throw new Error('City not found');
      return response.json();
    })
    .then(displayForecast)
    .catch(showError);
};

// Display Weather Data
const displayWeather = (data) => {
  const { name, sys, weather, main, wind } = data;
  weatherResult.innerHTML = `
    <h2 class="text-2xl font-bold mb-2">${name}, ${sys.country}</h2>
    <p class="text-lg mb-2 capitalize">${weather[0].description}</p>
    <p class="text-lg mb-1">🌡 Temperature: ${main.temp}°C</p>
    <p class="text-lg mb-1">💧 Humidity: ${main.humidity}%</p>
    <p class="text-lg mb-1">🌬 Wind Speed: ${wind.speed} m/s</p>
  `;
};

// Display 5-Day Forecast
const displayForecast = (data) => {
  const dailyData = data.list.filter((entry) => entry.dt_txt.includes('12:00:00'));
  forecastResult.innerHTML = dailyData
    .map((day) => {
      const date = new Date(day.dt_txt).toDateString();
      return `
        <div class="bg-blue-100 dark:bg-gray-700 p-4 rounded-md text-center">
          <p class="font-bold">${date}</p>
          <p>${day.weather[0].description}</p>
          <p>🌡 ${day.main.temp}°C</p>
        </div>
      `;
    })
    .join('');
};

// Show Error
const showError = (error) => {
  weatherResult.innerHTML = `<p class="text-red-500 font-bold">${error.message}</p>`;
};

// Geolocation Button
currentLocationButton.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      () => showError({ message: 'Could not get location' })
    );
  } else {
    showError({ message: 'Geolocation not supported by your browser' });
  }
});

// Search Button
searchButton.addEventListener('click', () => {
  const query = countryInput.value.trim();
  if (query) {
    fetchWeather(query);
    fetchForecast(query);
  } else {
    showError({ message: 'Please enter a valid city or country' });
  }
});
