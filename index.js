let Service, Characteristic;
const request = require('request');

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-ppcode-watchman", "PP Code Watchman", Watchman);
};

function Watchman(log, config) {
  this.log = log;

  this.host = config["host"];
  this.product_id = config["product_id"]; // printed on bottom of Watchman
  this.url = "http://" + this.host + "/" + this.product_id + "&Stats";
}

Watchman.prototype = {
  httpRequest: function(url, method, callback) {
    request({
      url: url,
      method: method
    },
    function (error, response, body) {
      callback(error, response, body)
    })
  },

  identify: function(callback) {
    this.log("Identify requested!");
    callback();
  },

  getCurrentTemperature: function (callback) {
    this.log ("getCurrentTemperature");

    this.getStats(function(error, stats) {
      error ? callback(error) : callback(null, stats.temperature);
    }.bind(this));
  },

  getCurrentRelativeHumidity: function (callback) {
    this.log ("getCurrentRelativeHumidity");

    this.getStats(function(error, stats) {
      error ? callback(error) : callback(null, stats.humidity);
    }.bind(this));
  },

  getStats: function(callback) {
    this.httpRequest(this.url, 'GET', function(error, response, body) {
      if (error) {
        this.log('getStats failed: %s', error);
        callback(error);
      }
      else {
        this.log('getStats success - %s', body);
        callback(null, {
          temperature: this.parseTemperature(body),
          humidity: this.parseHumidity(body)
        });
      }
    }.bind(this));
  },

  parseTemperature: function(body) {
    // °C for HomeKit compatibility (converted back to °F in app)
    return (parseFloat(body.match(/Temp:(\d{2}\.?\d{0,2})/)[1]) - 32) / 1.8;
  },

  parseHumidity: function(body) {
    return body.match(/Humi:(\d{2}\.?\d{0,2})%/)[1];
  },

  getTemperatureUnits: function (callback) {
    var that = this;
    that.log("getTemperature Units (F)");
    callback (null, 1);
  },

  getServices: function() {
    var informationService = new Service.AccessoryInformation();
    
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Person Place Code")
      .setCharacteristic(Characteristic.Model, "Watchman")
      .setCharacteristic(Characteristic.SerialNumber, "XXXXXX");
    
    var temperatureService = new Service.TemperatureSensor();
    temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .on('get', this.getCurrentTemperature.bind(this));

    
    var humidityService = new Service.HumiditySensor();

    humidityService
      .getCharacteristic(Characteristic.CurrentRelativeHumidity)
      .on('get', this.getCurrentRelativeHumidity.bind(this));

    return [informationService, temperatureService, humidityService];
  }
};
