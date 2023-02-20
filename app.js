require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/weather", (req, res) => {
  const cityName = req.body.cityName;
  const appKey = process.env.API_KEY;
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    appKey +
    "&units=" +
    unit;

  https.get(url, (response) => {
    response.on("data", (data) => {
      weatherData = JSON.parse(data);
      console.log(weatherData);

      if (!weatherData.main) {
        return res.status(weatherData.cod).render("error", {
          message: "City not found or invalid city name"
        });
      }

      temperature = weatherData.main.temp;
      weatherDescription = weatherData.weather[0].description;
      weatherImage = weatherData.weather[0].icon;
      imageURL =
        "https://openweathermap.org/img/wn/" + weatherImage + "@2x.png";
      weatherHumidity = weatherData.main.humidity;

      return res.render("result", {
        cityName: cityName,
        temperature: temperature,
        weatherDescription: weatherDescription,
        imageURL: imageURL,
        weatherHumidity: weatherHumidity
      });
    });
  });
});

app.listen(process.env.PORT || 3100, () => {
  console.log("Server is running on port 3100");
});
