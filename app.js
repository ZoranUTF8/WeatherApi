/*
connects to weather api and gets the weather that is than displayed.
 */


const express = require("express");
const app = express();

const https = require("https");
const bodyParser = require("body-parser");
const APIkey = "c8a2a6cf01001c4e8a527d24db0dfe9f";

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
// *** res is response from our server to client and response is from API server to us;

app.post("/", function(req, res) {
  const city = req.body.cityInput;
  const units = req.body.unitsInput;
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&appid=" + APIkey;
  console.log("City is: " + city + " Units are: " + units);


  https.get(url, function(response) {

    console.log("Status code: " + response.statusCode);
    if (response.statusCode === 200) {
      response.on("data", function(data) {
        var now = new Date();
        const timezoneLocal = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const weatherData = JSON.parse(data);
        const currentTemp = weatherData.main.temp;
        const feelsLike = weatherData.main.feels_like;
        const description = weatherData.weather[0].description;
        const countryName = weatherData.sys.country;
        const cityName = weatherData.name;
        const timezone = weatherData.timezone;
        const sunriseTime = weatherData.sys.sunrise;
        const sunsetTime = weatherData.sys.sunset;
        //weather icon
        const icon = weatherData.weather[0].icon;
        const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@4x.png";

        res.write("<head><link rel=stylesheet href=css/style3.css>");
        res.write("<body >");
        res.write("<h1>City name: " + cityName);
        res.write("<hr>Temp: " + currentTemp);
        res.write("&emsp;Feels like: " + feelsLike);
        res.write("<img src=" + imageUrl + ">");
        res.write("<br>Description: " + description);
        res.write("<br>Country name: " + countryName);
        res.write("<br>Timezone: " + timezone.toLocaleString());
        res.write("<br>Sunrise time: " + getTime(sunriseTime) + " local time.");
        res.write("<br>Sunset time: " + getTime(sunsetTime) + " local time.");
        res.write("<br>Local time: " + now);
        res.write("<hr> ");

        res.write("</h1><form action=/goBack method=POST><button class=btn type=submit name=button>Go back.</button></form></body>");

        res.send();

      });
    } else {
      res.sendFile(__dirname + "/fail.html");
    }


  });
});

app.post("/goBack", function(req, res) {
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server on");
});

function getTime(time) {

  var date = new Date(time * 1000);
  var timestr = date.toLocaleTimeString();
  return timestr;
}
