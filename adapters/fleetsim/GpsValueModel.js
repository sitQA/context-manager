var mongoose = require('mongoose');
var SensorValueModel = require('../../models/SensorValueModel');

var gpsSchema = new mongoose.Schema({
    speed: Number,
    bearing: Number,
    horizontalAccuracy: Number
});

// is a special type of SensorValue
var GpsValueModel = SensorValueModel.discriminator('GpsValue', gpsSchema);

module.exports = GpsValueModel;