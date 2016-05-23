process.env.NODE_ENV = 'test';
var chai = require('chai')
    , expect = chai.expect
    , should = chai.should();
var mongo = require('../db/mongo');
var ObjectModel = require('../models/ObjectModel');

describe('model tests', function () {

    before(function (done) {
        mongo.connect(() => {
            done();
        })
    });


    it('should have booted into the test env', () => {
        process.env.NODE_ENV.should.equal('test');
    });

    it('should create objects with nested sensors', () => {
        obj = new ObjectModel();
        obj.name = "TestObject";
        obj.objectId = "t1";
        obj.sensors.push({
            name: "testsensor1",
            quality: 0.9,
            type: 'temperature'
        });
        obj.sensors.push({
            name: "testsensor2",
            quality: 0.8,
            type: 'pressure'
        });
        obj.save();

    })


});
