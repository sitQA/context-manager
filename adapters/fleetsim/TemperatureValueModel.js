var mongoose = require('mongoose');
var SensorValueModel = require('../../models/SensorValueModel');

var temperatureSchema = new mongoose.Schema({
    temperature: Number
});

// temperatureValue is a special type of SensorValue
try {
    var TemperatureValueModel = SensorValueModel.discriminator('TemperatureValue', temperatureSchema);
} catch(e) {
    console.log(e);
}

module.exports = TemperatureValueModel;