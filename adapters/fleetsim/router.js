'use strict';
var express = require('express');
var router = express.Router();
var SensorValueModel = require('../../models/SensorValueModel');

router.get('/', function(req, res, next) {
    res.send({message: 'resource expects post requests from the fleetsim trucksimulation with telematics data'});
});

router.post('/', function(req, res, next) {
    //TODO: decompose message into sensors and store in appropriate collections
    res.statusCode = 204;
    res.send();
});

module.exports = router;