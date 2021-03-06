var mongoose = require('mongoose');
var amqp = require('../amqp/amqpSender');

var contextSchema = new mongoose.Schema({
    type: String,
    id: String,
    objectIds: {type: [String], index: true},
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

contextSchema.post('save', (doc) => {
    // publish new sensor values via AMQP
    amqp.publish(doc, doc.id + '.' + doc.type);
});

module.exports = mongoose.model('Context', contextSchema);