var apiKey = "2224505cee9f4588bff124921241312";
var row = document.getElementById("row");
var searchInput = document.getElementById("searchInput");
var directionMap = {
  N: "North",
  NE: "Northeast",
  E: "East",
  SE: "Southeast",
  S: "South",
  SW: "Southwest",
  W: "West",
  NW: "Northwest",
  NNE: "North-Northeast",
  ENE: "East-Northeast",
  ESE: "East-Southeast",
  SSE: "South-Southeast",
  SSW: "South-Southwest",
  WSW: "West-Southwest",
  WNW: "West-Northwest",
  NNW: "North-Northwest",
};

//Determine the user's location
const successCallback = async (poistion) => {
  const longitude = poistion.coords.longitude;
  const latitude = poistion.coords.latitude;
  try {
    var response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=3`
    );
    response = await response.json();
    const location = response.location;
    const forecast = response.forecast.forecastday;
    display(forecast, location);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    row.innerHTML = `  <div class=" error-message alert alert-danger border-0 text-center mx-auto rounded-4 py-2 shadow-lg">
            <h2>Error fetching data</h2>
            <p>Please try again later</p>
          </div>`;
  }
};
const errorCallback = (error) => {
  console.error("Geolocation error:", error);
  row.innerHTML = `
  <div class="error-message alert alert-danger border-0 text-center mx-auto rounded-4 py-2 shadow-lg">
    <h2>Location Access Denied</h2>
    <p>Please enable location services in your browser or device settings to use this feature.</p>
  </div>`;
};
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

// Search Function
searchInput.addEventListener("keyup", function (e) {
  if (e.target.value) {
    searchWeather(apiKey, e.target.value);
  } else {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }
});
async function searchWeather(key, query) {
  try {
    var response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${query}&days=3`
    );
    response = await response.json();
    if (response.error || !response.location || !response.forecast) {
      row.innerHTML = `
      <div class="error-message alert alert-danger border-0 text-center mx-auto rounded-4 py-2 shadow-lg">
        <h2>Location Not Found</h2>
        <p>We couldn't find weather data for "${query}". Please check your input and try again.</p>
      </div>`;
      return;
    }
    const location = response.location;
    const forecast = response.forecast.forecastday;
    display(forecast, location);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    row.innerHTML = `  <div class=" error-message alert alert-danger border-0 text-center mx-auto rounded-4 py-2 shadow-lg">
    <h2>Error fetching data</h2>
    <p>Please try again later</p>
  </div>`;
  }
}

// Display Function
function display(arr, location) {
  var cartoona = "";
  for (let i = 0; i < arr.length; i++) {
    var date = new Date(arr[i].date);
    var day = date.toLocaleDateString("en-US", { weekday: "long" });
    var month = date.toLocaleDateString("en-US", { month: "long" });
    var dateForHours = new Date();
    var hours = arr[i].hour[dateForHours.getHours()];
    const windDirection = directionMap[hours.wind_dir] || hours.wind_dir;
    cartoona += `<div class="col-lg-4 p-md-0" >
            <div class="weather-card card${i + 1}">
              <div
                class="card-header w-100 d-flex justify-content-between align-items-center"
              >
                <p class="mb-0">${day}</p>
                <p class="mb-0">${date.getDate()} ${month}</p>
              </div>
              <div class="card-body">
                <p class="location mb-0">${location.name}</p>
                <div
                  class="temperature "
                >
                  <span>${hours.temp_c}<sup>o</sup>C</span>
                  <img src="${hours.condition.icon}" alt="" />
                </div>
                <p class="Weather-condition">${hours.condition.text}</p>
                <div class="Weather-Details">
                  <span
                    ><img src="./images/icon-umberella.png" alt="" /> ${
                      hours.humidity
                    } %</span
                  >
                  <span
                    ><img src="./images/icon-wind.png" alt="" /> ${
                      hours.wind_kph
                    } Km/h</span
                  >
                  <span
                    ><img src="./images/icon-compass.png" alt="" /> ${windDirection}</span
                  >
                </div>
              </div>
            </div>
          </div>`;
  }
  row.innerHTML = cartoona;
}


