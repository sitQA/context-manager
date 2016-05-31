'use strict';
var express = require('express');
var router = express.Router();
var ObjectModel = require('../../models/ObjectModel');
var SensorValueModel = require('../../models/SensorValueModel');
var ObjectId = require('mongoose').Types.ObjectId;

router.get('/', function(req, res, next) {
    res.send({message: 'resource expects post requests from the fleetsim trucksimulation with telematics data'});
});

router.post('/', function(req, res, next) {
    var objId = req.body.truckId;
    var gpsSensor = {type: "gps", name: "gps", slug: "gps"};
    var tempSensor = {type: "temperature", name: "load temperature", slug: "load-temp"};

    var gpsVal = new SensorValueModel({
        objectId: objId,
        sensorId: "gps",
        position: req.body.position,
        speed: req.body.speed,
        bearing: req.body.bearing,
        horizontalAccuracy: req.body.horizontalAccuracy,
        quality: (100 - req.body.horizontalAccuracy) / 100,
        ts: req.body.timeStamp
    });

    var update= {
        "$set": {
            objectId: objId,
            lastSeen: req.body.timeStamp,
            type: "truck",
            "sensors.gps": gpsSensor,
            "sensors.temp": tempSensor
        }
    };
    var query = {objectId: objId};
    ObjectModel.findOneAndUpdate(query, update, {upsert: true, new: true, passRawResult: true}, (err, doc, raw) => {
        if(err) {
            next(err);
        } else {
            gpsVal.save(err => {
                if(err) {
                    console.log(err);
                    next(err);
                } else {
                    res.statusCode = 204;
                    res.send();
                }
            });

        }
    });
});

var exampleBody = {
    timeStamp: 28000,
    truckId: '574c99c162305b332bd81bf5',
    altitude: 0,
    verticalAccuracy: 20,
    bearing: 179.54760404596388,
    temperature: 20,
    horizontalAccuracy: 3,
    id: '574c99c162305b332bd81bf5',
    position:
    { type: 'Point', coordinates: [Object]
    },
    speed: 12.366375663492219 };


module.exports = router;