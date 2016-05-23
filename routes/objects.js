'use strict';
var express = require('express');
var router = express.Router();
var ObjectModel = require('../models/ObjectModel');

router.get('/', function(req, res, next) {
    const mongo = req.app.locals.db;
    mongo.collection('objects').find().toArray((err, docs) => {
        res.send(docs);
    });
});

router.post('/', function(req, res, next) {
    var obj = req.params.obj;
    getCollection(req).insertOne(req.body, (err, result) => {
        res.send(result);
    });
});

router.get('/:objId', function(req, res, next) {
    var id = req.params.objId;
    getCollection(req).find({_id: id}).limit(1).next((err, doc) => {
        res.send(doc);
    });
});


function getCollection(req) {
    const mongo = req.app.locals.db;
    return mongo.collection('objects');
}


module.exports = router;
