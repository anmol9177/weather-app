# Weather App

A modern, responsive weather application that provides current weather conditions and 5-day forecasts for any city worldwide.

## Features

- Search weather by city name
- Current weather conditions including:
  - Temperature
  - Weather description
  - Humidity
  - Wind speed
  - "Feels like" temperature
- 5-day weather forecast
- Temperature unit conversion (Celsius/Fahrenheit)
- Responsive design for all devices
- Dynamic weather icons

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- OpenWeather API
- Font Awesome icons

## Setup

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   ```

2. Get an API key:
   - Sign up at [OpenWeather](https://openweathermap.org/)
   - Go to your API keys section
   - Copy your API key

3. Configure the API key:
   - Open `script.js`
   - Replace the API_KEY value with your OpenWeather API key:
     ```javascript
     const API_KEY = 'your-api-key-here';
     ```

4. Open the app:
   - Open `index.html` in your web browser
   - Or serve it using a local development server

## Usage

1. Enter a city name in the search box
2. Press Enter or click the search button
3. View current weather and forecast
4. Toggle between Celsius and Fahrenheit using the unit buttons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Weather data provided by [OpenWeather](https://openweathermap.org/)
- Icons by [Font Awesome](https://fontawesome.com/) 