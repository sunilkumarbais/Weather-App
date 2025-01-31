import Config from "./config.js";

const button = document.querySelector("button");
const inputElement = document.querySelector("input");
const weatherElement = document.querySelector(".whether");

button.addEventListener("click", async () => {
  const apiKey = Config.API_KEY;
  const city = inputElement.value.trim();

  if (!city) {
    weatherElement.innerHTML = `<div style="color: red;">Please enter a city name</div>`;
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    // Show loading message
    weatherElement.innerHTML = `<div style="color: blue;">Loading weather data...</div>`;

    const response = await fetch(url);

    if (!response.ok) throw new Error("City not found");

    const body = await response.json();

    const windSpeed = (body.wind.speed * 3.6).toFixed(1);
    const windGust = body.wind.gust ? (body.wind.gust * 3.6).toFixed(1) : "N/A";
    const pressure = body.main.pressure;

    function convertUnixToTime(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000);
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    }

    const sunriseTime = convertUnixToTime(body.sys.sunrise);
    const sunsetTime = convertUnixToTime(body.sys.sunset);

    
    weatherElement.innerHTML = `
      <div><strong>&#128205; ${body.name},</strong> <span>${body.sys.country}</span></div>
      <div>&#128205; Latitude: ${body.coord.lat} | Longitude: ${body.coord.lon}</div>
      <div>🌡️ Temperature: ${Math.floor(body.main.temp)}°C</div>
      <div>💧 Humidity: ${body.main.humidity}%</div>
      <div>👁️ Visibility: ${(body.visibility / 1000).toFixed(1)} km</div>
      <div>🌬️ Wind: ${windSpeed} km/h</div>
      <div>💨 Gust: ${windGust} km/h</div>
      <div>🧭 Pressure: ${pressure} hPa</div>
      <div>🌅 Sunrise: ${sunriseTime}</div>
      <div>🌇 Sunset: ${sunsetTime}</div>
    `;
  } catch (error) {
    weatherElement.innerHTML = `<div style="color: red;">${error.message}</div>`;
  }
});
