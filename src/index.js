let weather = {
  paris: {
    temp: 19.7,
    humidity: 80,
  },
  tokyo: {
    temp: 17.3,
    humidity: 50,
  },
  lisbon: {
    temp: 30.2,
    humidity: 20,
  },
  "san francisco": {
    temp: 20.9,
    humidity: 100,
  },
  oslo: {
    temp: -5,
    humidity: 20,
  },
};

//------------------------------------------------
// alertAndSearchFromList();
//------------------------------------------------

function alertAndSearchFromList() {
  let city = prompt("Enter a city");

  if (city in weather) {
    let temp_city = weather[city].temp;
    let fahrenheit = temp_city * 1.8 + 32;
    let message = `It is currently ${Math.round(temp_city)}°C (${Math.round(
      fahrenheit
    )}°F) in Paris with a humidity of ${weather[city].humidity}%`;
    alert(message);
  } else {
    alert(
      `Sorry, we don't know the weather for this city, try going to https://www.google.com/search?q=weather+${city}`
    );
  }
}

// ---------------set date and default city temprature-------------------------
//------------------------------------------------------------------------------

function getDate(timestamp) {
  let now = new Date(timestamp);
  let dayNameLists = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let mituesVaule = now.getMinutes();
  if (mituesVaule < 10) {
    mituesVaule = "0" + mituesVaule;
  }
  let date = {
    dayName: dayNameLists[now.getDay()],
    hour: convertTime(now.getHours()),
    minutes: mituesVaule,
    timeRefrence: checkDayOrNight(now.getHours()),
  };
  return date;
}

function convertTime(hour) {
  if (hour > 12) {
    return hour - 12;
  }
  return hour;
}

function checkDayOrNight(hour) {
  if (hour < 12 || hour === 24) {
    return "AM";
  }
  return "PM";
}

function setDate(timestamp) {
  let dateInfo = getDate(timestamp);
  let day = document.querySelector(".day");
  let hour = document.querySelector(".hour");
  let minutes = document.querySelector(".minute");
  let timeRefrence = document.querySelector(".time_refrence");
  day.innerHTML = dateInfo["dayName"];
  hour.innerHTML = dateInfo["hour"];
  minutes.innerHTML = dateInfo["minutes"];
  timeRefrence.innerHTML = dateInfo["timeRefrence"];
}

function updateCityName(name) {
  let city = document.querySelector(".city_name");
  city.innerHTML = name;
}

// ---------------update units (f and c) functions -----------------------------
//------------------------------------------------------------------------------

let currentTempretureCel = 0;
let currentTempretureFah = 0;
let realFeelCel = 0;
let realFeelFah = 0;
let currentUnit = "c";

function celToFahValue(tempreture) {
  return Math.round(tempreture * 1.8 + 32);
}
function fahToCelValue(temperature) {
  return Math.round((temperature - 32) * (5 / 9));
}
function setCurrentTempretureValue(tempreture) {
  let CurrentTempreture = document.querySelector(".today-tempreture");
  CurrentTempreture.innerHTML = tempreture;
}

function convertToCelsius() {
  if (currentUnit === "c") {
    return;
  }
  setCurrentTempretureValue(currentTempretureCel);
  updateRealFeelTempreture(realFeelCel);
  currentUnit = "c";
  updateCssPropertiesForUnits();
  updateForecast("c");
}

function convertToFahrenheit() {
  if (currentUnit === "f") {
    return;
  }
  setCurrentTempretureValue(currentTempretureFah);
  updateRealFeelTempreture(realFeelFah);
  currentUnit = "f";
  updateCssPropertiesForUnits();
  updateForecast("f");
}

function updateCssPropertiesForUnits() {
  let celsiusSign = document.querySelector(".celsius");
  let fahrenheitSign = document.querySelector(".fahrenheit");
  if (currentUnit === "c") {
    celsiusSign.style.color = "black";
    fahrenheitSign.style.color = "rgb(134, 129, 129)";
  } else {
    fahrenheitSign.style.color = "black";
    celsiusSign.style.color = "rgb(134, 129, 129)";
  }
}

function updateUnitsOnClick() {
  let celsiusSign = document.querySelector(".celsius");
  let fahrenheitSign = document.querySelector(".fahrenheit");

  celsiusSign.addEventListener("click", convertToCelsius);
  fahrenheitSign.addEventListener("click", convertToFahrenheit);
}

//----------------functions related to search cities using api----------------------
//----------------------------------------------------------------------------------

let apiKey = "34bto1c24a73506fb3f6e281f6f1b23a";

function defaultSearchCity() {
  let url = `https://api.shecodes.io/weather/v1/current?query=New York&units=metric&key=${apiKey}`;
  axios.get(url).then(displayTempreture);
}

function searchCity(event) {
  event.preventDefault();
  let citySearchedName = document.querySelector("#search-city").value;
  let url = `https://api.shecodes.io/weather/v1/current?query=${citySearchedName}&units=metric&key=${apiKey}`;
  axios.get(url).then(displayTempreture);
}

function getLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let url = `https://api.shecodes.io/weather/v1/current?lat=${latitude}&lon=${longitude}&units=metric&key=${apiKey}`;
  axios.get(url).then(displayTempreture);
}

function displayTempreture(response) {
  currentTempretureCel = Math.round(response.data.temperature.current);
  currentTempretureFah = celToFahValue(currentTempretureCel);
  let city = response.data.city;
  let weatherDescription = response.data.condition.description;
  let humidity = response.data.temperature.humidity;
  let windSpeed = response.data.wind.speed;
  realFeelCel = response.data.temperature.feels_like;
  realFeelFah = celToFahValue(realFeelCel);
  let timestamp = response.data.time;
  let currentIconUrl = response.data.condition.icon_url;
  currentUnit = "c";
  forecastArrayCel = [];
  forecastArrayFah = [];
  setDate(timestamp * 1000);
  updateCityName(city);
  setCurrentTempretureValue(currentTempretureCel);
  updateWeatherDescription(weatherDescription);
  updateHumidity(humidity);
  updateWindSpeed(windSpeed);
  updateRealFeelTempreture(realFeelCel);
  updateCurrentIcon(currentIconUrl);
  getForcast(response.data.coordinates);
}

function updateCurrentIcon(iconUrl) {
  let currentIconElement = document.querySelector("#today-icon");
  currentIconElement.setAttribute("src", iconUrl);
}
function updateWeatherDescription(description) {
  let weatherDescription = document.querySelector(".weather-description");
  weatherDescription.innerHTML = description;
}

function updateHumidity(humidity) {
  let weatherHumidity = document.querySelector(".humidity-percentage");
  weatherHumidity.innerHTML = Math.round(humidity);
}

function updateWindSpeed(speed) {
  let windSpeed = document.querySelector(".wind-speed");
  windSpeed.innerHTML = Math.round(speed);
}

function updateRealFeelTempreture(temp) {
  let realFeelTemprature = document.querySelector(".real-feel");
  realFeelTemprature.innerHTML = `Feels like ${Math.round(temp)}°`;
}

function updateForecast(unit) {
  let forecastTemperature = document.querySelectorAll(
    ".weather-forcast-temperatures"
  );

  forecastTemperature.forEach(function (element, index) {
    let minElement = element.querySelector(".forcast-temperature-min");
    let maxElement = element.querySelector(".forcast-temperature-max");

    if (unit === "f") {
      minElement.innerHTML = forecastArrayFah[index].min + "°";
      maxElement.innerHTML = forecastArrayFah[index].max + "°";
    } else {
      minElement.innerHTML = forecastArrayCel[index].min + "°";
      maxElement.innerHTML = forecastArrayCel[index].max + "°";
    }
  });
}

function searchByCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getLocation);
}
function forecastFormatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let dayNameLists = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return dayNameLists[date.getDay()];
}
function getForcast(coordinates) {
  let url = `https://api.shecodes.io/weather/v1/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&key=${apiKey}&units=metric`;
  axios.get(url).then(showForcast);
}
let forecastArrayCel = [];
let forecastArrayFah = [];
function showForcast(response) {
  let forcastElement = document.querySelector("#forcast");
  let days = response.data.daily;
  let forcastContent = ``;

  days.forEach(function (day, index) {
    if (index === 0) {
      return;
    }

    let minMax = {
      min: Math.round(day.temperature.minimum),
      max: Math.round(day.temperature.maximum),
    };
    forecastArrayCel.push(minMax);
    forecastArrayFah.push({
      min: celToFahValue(minMax.min),
      max: celToFahValue(minMax.max),
    });

    forcastContent += `
      <div class="col-sm-2">
          <div class="weather-forcast-date">${forecastFormatDay(day.time)}</div>
          <img
            src="${day.condition.icon_url}"
            alt=""
            width="80"
          />
          <div class="weather-forcast-temperatures">
            <span class="forcast-temperature-max">${Math.round(
              minMax.max
            )}°</span>
            <span class="forcast-temperature-min">${Math.round(
              minMax.min
            )}°</span>
          </div>
      </div>
      `;
  });

  forcastElement.innerHTML = forcastContent;
}

// ---------------default city temprature-------------------------
defaultSearchCity();
setDate();
//------------------------------------------------------------------------------

updateUnitsOnClick();

//------------------------------------------------------------------------------

let citySearcForm = document.querySelector("#search_city_form");
citySearcForm.addEventListener("submit", searchCity);

let currentLocation = document.querySelector(".current_location");
currentLocation.addEventListener("click", searchByCurrentLocation);

showForcast();
