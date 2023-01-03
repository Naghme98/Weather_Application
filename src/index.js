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

//------------------------------------------------
// alertAndSearchFromList();
//------------------------------------------------

function getDate() {
  let now = new Date();
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

function setDate() {
  let dateInfo = getDate();
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

// ----------------------------------------
setDate();
//-----------------------------------------

let currentUnit = "c"; //if it is farenhite it would be "f"

function setCurrentTempretureValue(tempreture) {
  let CurrentTempreture = document.querySelector(".today-tempreture");
  CurrentTempreture.innerHTML = Math.round(tempreture);
}
function convertToCelsius() {
  if (currentUnit === "c") {
    return;
  }
  let tempreture = getCurrentTempreture();
  setCurrentTempretureValue((tempreture - 32) * (5 / 9));
  currentUnit = "c";
  updateCssPropertiesForUnits();
}
function convertToFahrenheit() {
  if (currentUnit === "f") {
    return;
  }
  let tempreture = getCurrentTempreture();
  setCurrentTempretureValue(tempreture * 1.8 + 32);
  currentUnit = "f";
  updateCssPropertiesForUnits();
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
function getCurrentTempreture() {
  return document.querySelector(".today-tempreture").innerHTML;
}

function updateUnitsOnClick() {
  let celsiusSign = document.querySelector(".celsius");
  let fahrenheitSign = document.querySelector(".fahrenheit");

  celsiusSign.addEventListener("click", convertToCelsius);
  fahrenheitSign.addEventListener("click", convertToFahrenheit);
}

//--------------------------------------
updateUnitsOnClick();
//--------------------------------------

let apiKey = "97bed167ec49bff56e6c1b63daef9c86";

let citySearcForm = document.querySelector("#search_city_form");
citySearcForm.addEventListener("submit", searchCity);

function searchCity(event) {
  event.preventDefault();
  let citySearchedName = document.querySelector("#search-city").value;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${citySearchedName}&units=metric&appid=${apiKey}`;
  axios.get(url).then(getTempreture);
}

function getLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  // console.log(latitude);
  // console.log(longitude);

  axios.get(url).then(getTempreture);
}

function getTempreture(response) {
  let currentTempreture = Math.round(response.data.main.temp);
  let city = response.data.name;
  let weatherDescription = response.data.weather[0].main;
  let humidity = response.data.main.humidity;
  let windSpeed = response.data.wind.speed;
  let minTemp = response.data.main.temp_min;
  let maxTemp = response.data.main.temp_max;
  // console.log(currentTempreture);
  // console.log(response.data);
  updateCityName(city);
  setCurrentTempretureValue(currentTempreture);
  updateWeatherDescription(weatherDescription);
  updateHumidity(humidity);
  updateWindSpeed(windSpeed);
  updateMaxAndMinTempreture(maxTemp, minTemp);
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

function updateMaxAndMinTempreture(maxTemp, minTemp) {
  let minTemprature = document.querySelector(".min");
  let maxTemprature = document.querySelector(".max");
  minTemprature.innerHTML = Math.round(minTemp);
  maxTemprature.innerHTML = Math.round(maxTemp);
}

function searchByCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getLocation);
}

let currentLocation = document.querySelector(".current_location");
currentLocation.addEventListener("click", searchByCurrentLocation);
