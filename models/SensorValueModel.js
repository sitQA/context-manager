var mongoose = require('mongoose');
var amqp = require('../amqp/amqpSender');

var sensorValueSchema = new mongoose.Schema({
    objectId: {type: String, index: true},
    sensorId: {type: String, index: true},
    // auto-remove old documents to prevent huge collections
    // might need to be disabled if impact on performance is too high
    // possible alternatives: capped collection, embedded fixed length arrays
    ts: {type: Date, index: {expireAfterSeconds: 3600 * 24}},
    quality: {
        type: Number,
        min: 0.0,
        max: 1.0
    }
}, {timestamps: true});

sensorValueSchema.post('save', (doc) => {
    // publish new sensor values via AMQP
    amqp.publish(doc, doc.objectId, doc.sensorid);
});

module.exports = mongoose.model('SensorValue', sensorValueSchema);