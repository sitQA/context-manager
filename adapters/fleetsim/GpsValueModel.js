var mongoose = require('mongoose');
var SensorValueModel = require('../../models/SensorValueModel');

var gpsSchema = new mongoose.Schema({
    speed: Number,
    bearing: Number,
    horizontalAccuracy: Number
});

// is a special type of SensorValue
try {
    var GpsValueModel = SensorValueModel.discriminator('GpsValue', gpsSchema);
} catch(e) {
    console.log(e);
}


module.exports = GpsValueModel;