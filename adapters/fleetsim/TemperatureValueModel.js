var mongoose = require('mongoose');
var SensorValueModel = require('../../models/SensorValueModel');

var temperatureSchema = new mongoose.Schema({
    temperature: Number
});

// temperatureValue is a special type of SensorValue
var TemperatureValueModel = SensorValueModel.discriminator('TemperatureValue', temperatureSchema);

module.exports = TemperatureValueModel;