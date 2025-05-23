// OpenWeather API configuration
const API_KEY = '5e79fa9fd77d5299f96342b8c844933f';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const celsiusBtn = document.getElementById('celsius');
const fahrenheitBtn = document.getElementById('fahrenheit');
const weatherIcon = document.getElementById('weather-icon');
const cityElement = document.querySelector('.city');
const tempElement = document.getElementById('temp');
const descElement = document.querySelector('.description');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const feelsLikeElement = document.getElementById('feels-like');
const forecastContainer = document.getElementById('forecast-container');

// Verify all DOM elements are found
if (!searchInput || !searchButton || !celsiusBtn || !fahrenheitBtn || 
    !weatherIcon || !cityElement || !tempElement || !descElement || 
    !humidityElement || !windSpeedElement || !feelsLikeElement || !forecastContainer) {
    console.error('Some DOM elements were not found. Check your HTML structure.');
}

// State
let currentUnit = 'celsius';
let currentWeatherData = null;

// Functions
function updateWeatherDisplay(data) {
    if (!data || !data.main || !data.weather || !data.weather[0]) {
        console.error('Invalid weather data structure:', data);
        clearWeatherDisplay();
        return;
    }

    try {
        cityElement.textContent = data.name ? `${data.name}${data.sys?.country ? `, ${data.sys.country}` : ''}` : 'Unknown Location';
        tempElement.textContent = Math.round(data.main.temp);
        descElement.textContent = data.weather[0].description || 'No description available';
        humidityElement.textContent = `${data.main.humidity || 0}%`;
        windSpeedElement.textContent = `${Math.round((data.wind?.speed || 0) * 3.6)} km/h`;
        feelsLikeElement.textContent = `${Math.round(data.main.feels_like)}°${currentUnit === 'fahrenheit' ? 'F' : 'C'}`;
        
        if (data.weather[0].icon) {
            weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
            weatherIcon.alt = data.weather[0].description;
        }
    } catch (error) {
        console.error('Error updating weather display:', error);
        clearWeatherDisplay();
    }
}

function updateForecastDisplay(data) {
    try {
        if (!forecastContainer) return;
        forecastContainer.innerHTML = '';

        if (!data?.list || !Array.isArray(data.list)) {
            throw new Error('Invalid forecast data format');
        }

        // Get one forecast per day (excluding current day)
        const dailyForecasts = data.list.filter(item => {
            if (!item?.dt) return false;
            const date = new Date(item.dt * 1000);
            return date.getHours() === 12;
        }).slice(0, 5);

        dailyForecasts.forEach(forecast => {
            if (!forecast) return;

            const date = new Date(forecast.dt * 1000);
            const temp = forecast?.main?.temp;
            const description = forecast?.weather?.[0]?.description || 'No description';
            const iconCode = forecast?.weather?.[0]?.icon || '01d';

            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="date">${formatDate(date)}</div>
                <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${description}">
                <div class="temp">${temp != null ? Math.round(temp) : '--'}°${currentUnit === 'fahrenheit' ? 'F' : 'C'}</div>
                <div class="description">${description}</div>
            `;
            forecastContainer.appendChild(forecastItem);
        });
    } catch (error) {
        console.error('Error updating forecast display:', error);
        if (forecastContainer) forecastContainer.innerHTML = '<p>Forecast data unavailable</p>';
    }
}

function clearWeatherDisplay() {
    cityElement.textContent = 'Weather Unavailable';
    tempElement.textContent = '--';
    descElement.textContent = 'Please try again later';
    humidityElement.textContent = '--%';
    windSpeedElement.textContent = '-- km/h';
    feelsLikeElement.textContent = '--°C';
    weatherIcon.src = '';
    forecastContainer.innerHTML = '';
}

async function getWeatherData(city) {
    try {
        if (!city) {
            throw new Error('Please enter a city name');
        }

        // Using geocoding API first to get coordinates
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        if (!geoData || !Array.isArray(geoData) || geoData.length === 0) {
            throw new Error('City not found. Please check the spelling and try again.');
        }

        const location = geoData[0];
        if (!location?.lat || !location?.lon) {
            throw new Error('Invalid location data received');
        }

        // Get current weather using coordinates
        const weatherUrl = `${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (!weatherResponse.ok) {
            throw new Error(weatherData.message || 'Failed to fetch weather data');
        }

        // Store the current weather data
        currentWeatherData = weatherData;

        // Get 5-day forecast
        const forecastUrl = `${BASE_URL}/forecast?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        if (!forecastResponse.ok) {
            throw new Error(forecastData.message || 'Failed to fetch forecast data');
        }

        // Update the displays
        updateWeatherDisplay(weatherData);
        updateForecastDisplay(forecastData);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(`Error: ${error.message}`);
        clearWeatherDisplay();
    }
}

function formatDate(date) {
    try {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date instanceof Date ? date.toLocaleDateString('en-US', options) : 'Invalid Date';
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Date Unavailable';
    }
}

// Event listeners
if (searchButton) {
    searchButton.addEventListener('click', () => {
        const city = searchInput?.value?.trim();
        if (city) {
            getWeatherData(city);
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = searchInput.value.trim();
            if (city) {
                getWeatherData(city);
            }
        }
    });
}

if (celsiusBtn) {
    celsiusBtn.addEventListener('click', () => {
        if (currentUnit !== 'celsius') {
            currentUnit = 'celsius';
            updateUnitButtons();
            if (currentWeatherData) {
                updateWeatherDisplay(currentWeatherData);
            }
        }
    });
}

if (fahrenheitBtn) {
    fahrenheitBtn.addEventListener('click', () => {
        if (currentUnit !== 'fahrenheit') {
            currentUnit = 'fahrenheit';
            updateUnitButtons();
            if (currentWeatherData) {
                updateWeatherDisplay(currentWeatherData);
            }
        }
    });
}

function updateUnitButtons() {
    if (celsiusBtn && fahrenheitBtn) {
        celsiusBtn.classList.toggle('active', currentUnit === 'celsius');
        fahrenheitBtn.classList.toggle('active', currentUnit === 'fahrenheit');
    }
}

// Initialize with a default city
window.addEventListener('load', () => {
    getWeatherData('London');
});
