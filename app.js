require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/", (req,res) => {
    res.render("home");
    
});

app.post("/weather", (req,res) => {
    
    const cityName = req.body.cityName;
    const appKey = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName +"&appid=" +appKey+ "&units=" + unit;
    https.get(url, (response) => {
        console.log(response.statusCode);

        response.on("data", (data) => {
            weatherData = JSON.parse(data);
            temperature = weatherData.main.temp;
            weatherDescription = weatherData.weather[0].description;
            weatherImage = weatherData.weather[0].icon;
            imageURL = "http://openweathermap.org/img/wn/" + weatherImage + "@2x.png";
            weatherHumidity = weatherData.main.humidity;

            res.render("result", {
                cityName: cityName, 
                temperature: temperature,
                weatherDescription: weatherDescription,
                imageURL: imageURL,
                weatherHumidity: weatherHumidity 
            });
            console.log(weatherData);
        });
    });  
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});