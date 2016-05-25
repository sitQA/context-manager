process.env.NODE_ENV = 'test';
var chai = require('chai')
    , expect = chai.expect
    , should = chai.should();
var mongo = require('../db/mongo');
var ObjectModel = require('../models/ObjectModel');
var objectFixtures = require('./fixtures/objects.json');

describe('model tests', function () {

    before(function (done) {
        mongo.connect(() => {
            // remove old data
            ObjectModel.remove({}).then(function(res) {
                ObjectModel.collection.insert(objectFixtures, {}, function(res){
                    console.log(res);
                    done();
                });
            });
        });
    });


    it('should have booted into the test env', () => {
        process.env.NODE_ENV.should.equal('test');
    });

    it('should create objects with nested sensors', (done) => {
        obj = new ObjectModel();
        obj.name = "TestObject";
        obj.objectId = "object";
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
        obj.save(err => {
            expect(err).to.be.null;
            done();
        });

    });

    it('duplicate object ids should be forbidden', done => {
        var obj = new ObjectModel();
        obj.objectId = objectFixtures[0].objectId;
        obj.save(err => {
            expect(err).to.be.not.null;
            done();
        });

    });


});
