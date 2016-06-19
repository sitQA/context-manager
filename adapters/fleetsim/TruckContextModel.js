var mongoose = require('mongoose');
var ContextModel = require('../../models/ContextModel');

/**
 * Context which correlates truck positions and traffic positions.
 */
var truckContextSchema = new mongoose.Schema({
    trafficObj: {type: mongoose.Schema.Types.Mixed}, // incident as reported by the traffic service
    gpsValue: {type: mongoose.Schema.Types.Mixed} //sensor value
});

var TruckContextModel = ContextModel.discriminator('TruckContext', truckContextSchema);

module.exports = TruckContextModel;