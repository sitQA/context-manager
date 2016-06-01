var mongoose = require('mongoose');
var ContextModel = require('../../models/ContextModel');

/**
 * Context which correlates truck positions and traffic positions.
 */
var truckContextSchema = new mongoose.Schema({
    closestTraffic: {
        trafficObj: {type: mongoose.Schema.Types.Mixed}, // incident as reported by the traffic service
        distance: {type: number} // distance between truck and traffic incident
    },
    gpsValue: {type: mongoose.Schema.Types.Mixed} //sensor value
});

var TruckContextModel = SensorValueModel.discriminator('TemperatureValue', truckContextSchema);

module.exports = TruckContextModel;