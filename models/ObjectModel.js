var mongoose = require('mongoose');


var sensorSchema = new mongoose.Schema({
    name: String,
    url: String,
    quality: {
        type: Number,
        min: 0.0,
        max: 1.0
    },
    type: String,
    unit: String,
    unitSymbol: String

});


var objectSchema = new mongoose.Schema({
    objectId: String,
    name: String,
    type: String,
    sensors: [sensorSchema]
});

module.exports = mongoose.model('Object', objectSchema);

