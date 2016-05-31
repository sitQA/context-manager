var mongoose = require('mongoose');

var objectSchema = new mongoose.Schema({
    objectId: {type: String, index: {unique: true}},
    name: String,
    type: String,
    sensors: {type: mongoose.Schema.Types.Mixed, default: {}}
});

objectSchema.method('hasSensor', function(sensorSlug) {
    return this.model('Object').sensors.hasOwnProperty(sensorSlug);
});

objectSchema.method('getSensor', function(sensorSlug) {
    console.log(this);
    return this.sensors[sensorSlug];
});

module.exports = mongoose.model('Object', objectSchema);

