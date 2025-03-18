function refreshWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let date = new Date(response.data.time * 1000);
  let weatherIconElement = document.querySelector(".weather-icon img");

  let iconMapping = {
    "clear-sky-day": "icons/sun.gif",
    "clear-sky-night": "icons/sun.gif",
    "few-clouds-day": "icons/sun-clouds.gif",
    "few-clouds-night": "icons/sun-clouds.gif",
    "scattered-clouds-day": "icons/cloudy.gif",
    "scattered-clouds-night": "icons/cloudy.gif",
    "broken-clouds-day": "icons/cloudy.gif",
    "broken-clouds-night": "icons/cloudy.gif",
    "shower-rain-day": "icons/rain.gif",
    "shower-rain-night": "icons/rain.gif",
    "rain-day": "icons/sun-rain.gif",
    "rain-night": "icons/rain.gif",
    "thunderstorm-day": "icons/storm.gif",
    "thunderstorm-night": "icons/storm.gif",
    "snow-day": "icons/snow.gif",
    "snow-night": "icons/snow.gif",
    "mist-day": "icons/cloudy.gif",
    "mist-night": "icons/cloudy.gif",
  };

  let weatherIcon = response.data.condition.icon;
  let iconSrc = iconMapping[weatherIcon] || "icons/cloudy.gif";

  weatherIconElement.src = iconSrc;
  weatherIconElement.alt = response.data.condition.description;

  cityElement.innerHTML = response.data.city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
  temperatureElement.innerHTML = Math.round(temperature);
}

function refreshForecast(response) {
  let forecastElement = document.querySelector(".weekly-forecast");
  let forecastData = response.data.daily;

  let iconMapping = {
    "clear-sky-day": "icons/sun.gif",
    "clear-sky-night": "icons/sun.gif",
    "few-clouds-day": "icons/sun-clouds.gif",
    "few-clouds-night": "icons/sun-clouds.gif",
    "scattered-clouds-day": "icons/cloudy.gif",
    "scattered-clouds-night": "icons/cloudy.gif",
    "broken-clouds-day": "icons/cloudy.gif",
    "broken-clouds-night": "icons/cloudy.gif",
    "shower-rain-day": "icons/rain.gif",
    "shower-rain-night": "icons/rain.gif",
    "rain-day": "icons/sun-rain.gif",
    "rain-night": "icons/rain.gif",
    "thunderstorm-day": "icons/storm.gif",
    "thunderstorm-night": "icons/storm.gif",
    "snow-day": "icons/snow.gif",
    "snow-night": "icons/snow.gif",
    "mist-day": "icons/cloudy.gif",
    "mist-night": "icons/cloudy.gif",
  };

  let forecastHTML = "";

  forecastData.forEach((day, index) => {
    if (index < 7) {
      let date = new Date(day.time * 1000);
      let daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      let weekday = daysOfWeek[date.getDay()];

      let maxTemp = Math.round(day.temperature.maximum);
      let minTemp = Math.round(day.temperature.minimum);
      let weatherIcon = day.condition.icon;
      let iconSrc = iconMapping[weatherIcon] || "icons/cloudy.gif";

      forecastHTML += `
        <div class="day">
          <p>${weekday}</p>
          <img src="${iconSrc}" alt="${day.condition.description}" />
          <p><strong>${maxTemp}º</strong> <span>${minTemp}º</span></p>
        </div>
      `;
    }
  });

  forecastElement.innerHTML = forecastHTML;
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "ta4d13o783b04c3ee4a956ed2febde0f";
  let currentWeatherUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios.get(currentWeatherUrl).then(refreshWeather).catch(handleError);
  axios.get(forecastUrl).then(refreshForecast).catch(handleError);
}

function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

function handleError(error) {
  alert("City not found! Please enter a valid city name.");
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

searchCity("Lisbon");
