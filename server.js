// Basically imports and setting app instances
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

// Grants access to Weather API
const apiKey = 'fc027be393e03696097e152634e9e36e';

// Allows express to gain access to static file in the public sphere
app.use(express.static('public'));

// Allows access to the 'req.body' object
app.use(bodyParser.urlencoded({ extended: true }));

// This could be considered similar to Jinja2
app.set('view engine', 'ejs')

// First thing displayed (root url); no actual functionality other than rendering HTML
app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

// Seperate function for post requests, but same view
// Seperated because this comes second, after the regular, nonperforming, index is displayed
app.post('/', function (req, res) {
  let city = req.body.city;
  // Uses both 'city' and 'apiKey' varibles to deliver data
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  // Returns error messages if the city is not found or if the data is null
  request(url, function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'City not found, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'City not found, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        // Allows the weather to be displayed dynamically through ejs
        res.render('index', {weather: weatherText, error: null});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Weather app listening on port 3000!')
})