'use strict';
var express = require('express');
var router = express.Router();
var ObjectModel = require('../models/ObjectModel');

// set object model in req context
router.param("objId", function(req, res, next, id) {
    ObjectModel.findOne({"objectId": id}).exec((err, doc) => {
        if(err) {
            next(err);
        } else if (doc === null) {
            var err = new Error('No object with id ' +  id + ' found');
            err.status = 404;
            next(err);
        } else {
            req.object = doc;
            next();
        }
    });
});

// set sensor model in req context
router.param("sensorId", function(req, res, next, id) {
    var sensor = req.object.sensors.id(id);
    if(sensor === null) {
        var err = new Error('Object does not have a sensor with id ' + id);
        err.status = 404;
        next(err);
    } else {
        req.sensor = sensor;
        next();
    }

});

router.get('/', function(req, res, next) {
    ObjectModel.find().exec((err, docs) => {
        if(err) {
            next(err);
        }
        res.send(docs);
    });
});

router.post('/', function(req, res, next) {
    console.log(req.body);
    var obj = new ObjectModel(req.body);
    obj.save((err) => {
        if(err) {
            next(err);
        } else {
            res.statusCode = 201;
            res.send(obj);
        }
    })
});

router.get('/:objId', function(req, res, next) {
    res.send(req.object);
});

router.delete('/:objId', function(req, res, next) {
    req.object.remove(err => {
        if(err) {
            next(err);
        } else {
            res.statusCode = 204;
            res.send();
        }
    });
});

router.get('/:objId/sensors', function(req, res, next) {
    res.send(req.object.sensors);
});

router.post('/:objId/sensors', function(req, res, next) {
    req.object.sensors.push(req.body);
    req.object.save(err => {
        if(err) {
            next(new Error("could not save sensor"));
        } else {
            res.statusCode = 201;
            //TODO: return obj with _id that has been assigned to doc
            res.send(req.body);
        }
    });
});

router.get('/:objId/sensors/:sensorId', function(req, res, next) {
    var id = req.params.sensorId;
    res.send(req.sensor);
});

module.exports = router;
