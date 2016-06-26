'use strict';
var conf = require('./conf');
var express = require('express');
var router = express.Router();
var ObjectModel = require('../../models/ObjectModel');
var GpsValueModel = require('./GpsValueModel');
var TruckContextModel = require('./TruckContextModel');
var TemperatureValueModel = require('./TemperatureValueModel');
var http = require('http');

router.get('/', function(req, res, next) {
    res.send({message: 'resource expects post requests from the fleetsim trucksimulation with telematics data'});
});

router.post('/', saveObjectAndSensor);
router.post('/', saveSensorValues);
router.post('/', saveTrafficContext);


/**
 * Extracts the object id from the message and makes sure that the object and its sensors are logically represented in
 * the context manager.
 * In production mode this should be disabled. Instead objects should be registered manually and messages from
 * unknown sources should be discarded.
 */
function saveObjectAndSensor(req, res, next) {
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
}

/**
 * Decomposes the message received from the telemetry box and stores values of the sensors as separate
 * documents in the DB.
 *
 * @param req
 * @param res
 * @param next
 */
function saveSensorValues(req, res, next) {
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
}


/**
 * Queries the traffic service to retrieve the truck's distance to the closest traffic jam.
 * Calculates the quality of this information and stores the result in the DBs context collection.
 *
 * @param req
 * @param res
 * @param next
 */
function saveTrafficContext(req, res, next) {
    var objId = req.body.truckId;
    var lat = req.body.position.coordinates[1];
    var lon = req.body.position.coordinates[0];
    var serviceUrl = conf.get('trafficService');
    var url = `${serviceUrl}?lat=${lat}&lon=${lon}`;


    try {
        http.get(url, response => {
            var body = '';
            response.on('data', chunk => {
                body += chunk;
            });
            response.on('end', () => {
                var traffics = JSON.parse(body);
                if(traffics.length > 0) {
                    var traffic = traffics[0];
                    var trafficAgeSeconds = (new Date() - new Date(traffic.reported * 1000)) / 1000;
                    var truckContext = new TruckContextModel({
                        type: 'traffic',
                        objectIds: [objId, traffic.incidentId],
                        id: objId,
                        trafficObj: traffic,
                        quality: timeliness(trafficAgeSeconds) // quality depends on age of traffic report
                    });
                    // determine distance to closest traffic jam
                    truckContext.save(err => {
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
    } catch(ex) {
        next(ex);
    }
}

/**
 *
 * @param age age of the information in seconds
 * @param tolerance max age at which the information is still up to date (q = 100%)
 * @param max age at which the information becomes worthless (q = 0%)
 * @returns {number}
 */
function timeliness(age, tolerance, max) {
    tolerance = isNaN(tolerance) ? 20 : tolerance;
    max = isNaN(max) ? 3600 : max;
    if (age - tolerance <= 0) {
        return 1.0
    } else if (age >= max) {
        return 0.0;
    } else {
        return 1.0 - age / max;
    }
}



module.exports = router;