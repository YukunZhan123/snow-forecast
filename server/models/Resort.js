const mongoose = require('mongoose');

const WeatherDetailsSchema = new mongoose.Schema({
  id: Number,
  main: String,
  description: String,
  icon: String,
});

const TemperatureDetailsSchema = new mongoose.Schema({
  day: Number,
  min: Number,
  max: Number,
  night: Number,
  eve: Number,
  morn: Number,
});

const FeelsLikeSchema = new mongoose.Schema({
  day: Number,
  night: Number,
  eve: Number,
  morn: Number,
});

const DailyForecastSchema = new mongoose.Schema({
  dt: Date,
  sunrise: Date,
  sunset: Date,
  moonrise: Date,
  moonset: Date,
  moon_phase: Number,
  summary: String,
  temp: TemperatureDetailsSchema,
  feels_like: FeelsLikeSchema,
  pressure: Number,
  humidity: Number,
  dew_point: Number,
  wind_speed: Number,
  wind_deg: Number,
  weather: [WeatherDetailsSchema],
  clouds: Number,
  pop: Number,
  rain: Number,
  snow: Number,
  uvi: Number,
});

const AlertSchema = new mongoose.Schema({
  sender_name: String,
  event: String,
  start: Date,
  end: Date,
  description: String,
  tags: [String],
});

const CurrentWeatherSchema = new mongoose.Schema({
  dt: Date,
  sunrise: Date,
  sunset: Date,
  temp: Number,
  feels_like: Number,
  pressure: Number,
  humidity: Number,
  dew_point: Number,
  clouds: Number,
  uvi: Number,
  visibility: Number,
  wind_speed: Number,
  wind_deg: Number,
  weather: [WeatherDetailsSchema],
  rain: { '1h': Number },
  snow: { '1h': Number },
});

const ResortSchema = new mongoose.Schema({
  name: String,
  location: String,
  lat: Number,
  lon: Number,
  timezone: String,
  timezone_offset: Number,
  weather: {
    current: CurrentWeatherSchema,
    minutely: [{
      dt: Date,
      precipitation: Number,
    }],
    hourly: [CurrentWeatherSchema], // Simplified to reuse current weather schema
    daily: [DailyForecastSchema],
    alerts: [AlertSchema],
  },
});

module.exports = mongoose.model('Resort', ResortSchema);
