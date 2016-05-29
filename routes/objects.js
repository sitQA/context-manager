'use strict';
var express = require('express');
var router = express.Router();
var ObjectModel = require('../models/ObjectModel');

router.get('/', function(req, res, next) {
    ObjectModel.find().exec((err, docs) => {
        res.send(docs);
    });
});

router.post('/', function(req, res, next) {
    var obj = new ObjectModel(req.params.obj);
    obj.save((err) => {
        if(err) {
            res.send(err);
        } else {
            req.send(obj);
        }
    })
});

router.get('/:objId', function(req, res, next) {
    var id = req.params.objId;

    ObjectModel.findOne({"objectId": id}).exec((err, doc) => {
        if(err) {
            res.send(err);
        } else if (doc === null) {
            res.statusCode = 404;
            res.send({error: "not found"});
        } else {
            res.send(doc);
        }
    });
});

router.get('/:objId/sensors', function(req, res, next) {
    var id = req.params.objId;

});

router.get('/:objId/sensors/:sensorId', function(req, res, next) {
    var id = req.params.objId;

});

module.exports = router;
