var mongoose = require('mongoose');

var objectSchema = new mongoose.Schema({
    objectId: {type: String, index: {unique: true}},
    name: String,
    type: String,
    sensors: {type: mongoose.Schema.Types.Mixed, default: {}}
});

objectSchema.method('hasSensor', function(sensorSlug) {
    return this.sensors.hasOwnProperty(sensorSlug);
});

objectSchema.method('getSensor', function(sensorSlug) {
    return this.sensors[sensorSlug];
});

objectSchema.method('getSensorArray', function() {
    var arr = [];
    if(this.sensors instanceof Object) {
        for(property in this.sensors) {
            arr.push(property);
        }
    }
    return arr;
});

objectSchema.method('addSensor', function(sensor) {
    this.sensors[sensor.slug] = sensor;
    this.markModified('sensors');
});

objectSchema.method('removeSensor', function(slug) {
    delete this.sensors[slug];
    this.markModified('sensors');
});

//TODO: validate sensors on save

module.exports = mongoose.model('Object', objectSchema);

