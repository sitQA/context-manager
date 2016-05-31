var mongoose = require('mongoose');

var sensorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    slug: {type: String, lowercase: true, trim: true, required: true},
    description: String,
    url: String,
    quality: {
        type: Number,
        min: 0.0,
        max: 1.0
    },
    type: String,
    unit: String,
    unitSymbol: String
}, { _id: false, id: false });

module.exports = mongoose.model('Sensor', sensorSchema);