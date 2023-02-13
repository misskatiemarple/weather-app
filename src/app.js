function formatDate(now) {
  let date = now.getDate();
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = now.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];
  return `${day} ${date}, ${hours}:${minutes}`;
}
let dateElement = document.querySelector("#date-time");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function search(city) {
  let apiKey = "3041fdbb74ta3a686b2ca3f782407o93";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

let searchButton = document.querySelector("#search-form");
searchButton.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#searchtextinput");
  search(cityInput.value);
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class ="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col-2">
                <div class="weather-forecast-date">${formatForecastDay(
                  forecastDay.time
                )}</div>
                <img src="${
                  forecastDay.condition.icon_url
                }" alt ="#"" width ="36"/>
                <div class="weather-forecast-temperature">
                  <span class="weather-forecast-temperature-max">${Math.round(
                    forecastDay.temperature.maximum
                  )}°C </span>
                  <span class="weather-forecast-temperature-min">${Math.round(
                    forecastDay.temperature.minimum
                  )}°C</span>
                </div>
            </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "3041fdbb74ta3a686b2ca3f782407o93";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.city;
  let tempElement = document.querySelector("#current-temperature");
  tempElement.innerHTML = Math.round(response.data.temperature.current);
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.temperature.humidity;
  let description = document.querySelector("#description");
  description.innerHTML = response.data.condition.description;
  let iconElement = document.querySelector("#icon");
  iconElement.src = response.data.condition.icon_url;
  iconElement.setAttribute("alt", response.data.condition.description);

  let outfit = document.querySelector("#card-text");
  if (tempElement.innerHTML < 8) {
    outfit.innerHTML = "Brr...! Wear a winter coat today";
  } else if (tempElement.innerHTML < 12) {
    outfit.innerHTML = "Wear a trench coat today";
  } else if (tempElement.innerHTML < 16) {
    outfit.innerHTML = "Wear a cozy sweater today";
  } else if (tempElement.innerHTML < 20) {
    outfit.innerHTML = "Wear a long-sleeved T-shirt or cardigan today";
  } else if (tempElement.innerHTML < 25) {
    outfit.innerHTML = "Wear a T-shirt today";
  } else if (tempElement.innerHTML > 25) {
    outfit.innerHTML = "It's hot! <br />Wear a vest or tank top today";
  }
  celsiusTemperature = response.data.temperature.current;

  getForecast(response.data.coordinates);
}

function handleGeoPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchGeoTemperature);
}

let geoButton = document.querySelector("#geoSearchButton");
geoButton.addEventListener("click", handleGeoPosition);

function searchGeoTemperature(position) {
  let apiKey = "3041fdbb74ta3a686b2ca3f782407o93";
  let url = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${apiKey}`;
  axios.get(url).then(displayTemperature);
}
search("Tokyo");
