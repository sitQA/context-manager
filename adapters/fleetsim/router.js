'use strict';
var conf = require('./conf');
var express = require('express');
var router = express.Router();
var ObjectModel = require('../../models/ObjectModel');
var GpsValueModel = require('./GpsValueModel');
var TruckContextModel = require('./TruckContextModel');
var TemperatureValueModel = require('./TemperatureValueModel');

router.get('/', function(req, res, next) {
    res.send({message: 'resource expects post requests from the fleetsim trucksimulation with telematics data'});
});



// make sure objects and sensors are present as logical representation
router.post('/', function(req, res, next) {
    var objId = req.body.truckId;
    var gpsSensor = {type: "gps", name: "gps", slug: "gps"};
    var tempSensor = {type: "temperature", name: "load temperature", slug: "load-temp"};

    var update = {
        "$set": {
            objectId: objId,
            lastSeen: req.body.timeStamp,
            type: "truck",
            "sensors.gps": gpsSensor,
            "sensors.load-temp": tempSensor
        }
    };
    var query = {objectId: objId};
    ObjectModel.findOneAndUpdate(query, update, {upsert: true, new: true, passRawResult: true}, (err, doc, raw) => {
        if(err) {
            next(err);
        } else {
            next();
        }
    });
});

// save sensor values
router.post('/', function(req, res, next) {
    var objId = req.body.truckId;

    var gpsVal = new GpsValueModel({
        objectId: objId,
        sensorId: "gps",
        position: req.body.position,
        speed: req.body.speed,
        bearing: req.body.bearing,
        horizontalAccuracy: req.body.horizontalAccuracy,
        quality: (100 - req.body.horizontalAccuracy) / 100,
        ts: new Date(req.body.timeStamp)
    });

    var tempVal = new TemperatureValueModel({
        objectId: objId,
        sensorId: "load-temp",
        temperature: ""+req.body.temperature,
        ts: new Date(req.body.timeStamp)
    });

    gpsVal.save(err => {
        if(err) {
            console.log(err);
            next(err);
        }
    });
    tempVal.save(err => {
        if(err) {
            console.log(err);
        }
    });

    next();
});



// save context object
router.post('/', function(req, res, next) {
    var objId = req.body.truckId;
    var truckContext = new TruckContextModel({
        objectIds: [objId]
    });
    
    // determine distance to closest traffic jam
    truckContext.save(err => {
        if(err) {
            next(err);
        } else {
            res.statusCode = 204;
            res.send();
        }
    });
});



module.exports = router;