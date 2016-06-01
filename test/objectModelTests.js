process.env.NODE_ENV = 'test';
var chai = require('chai')
    , expect = chai.expect
    , should = chai.should();
var mongo = require('../db/mongo');
var ObjectModel = require('../models/ObjectModel');
var SensorValueModel = require('../models/SensorValueModel');
var objectFixtures = require('./fixtures/objects.json');
var amqp = require('../amqp/amqpSender');

describe('model tests', function () {

    before(function (done) {
        mongo.connect(() => {
            // remove old data
            ObjectModel.remove({}).then(function(res) {
                ObjectModel.collection.insert(objectFixtures, {}, function(res){
                    done();
                });
            });
        });
    });


    it('should have booted into the test env', () => {
        process.env.NODE_ENV.should.equal('test');
    });

    it('should provide sensor access via instance methods', () => {
        obj = new ObjectModel();
        obj.name = "TestObject";
        obj.objectId = "object";
        obj.sensors.testsensor1 = {
            name: "testsensor1",
            quality: 0.9,
            type: 'temperature'
        };
        var testsensor2 = {
            name: "testsensor2",
            quality: 0.8,
            type: 'pressure'
        };
        obj.sensors.testsensor2 = testsensor2;
        var hasSesnors = obj.hasSensor("testsensor1") && obj.hasSensor("testsensor2");
        expect(hasSesnors).to.be.true;
        expect(obj.getSensor("testsensor2")).to.equal(testsensor2);

    });

    it('duplicate object ids should be forbidden', done => {
        var obj = new ObjectModel();
        obj.objectId = objectFixtures[0].objectId;
        obj.save(err => {
            expect(err).to.be.not.null;
            done();
        });

    });

    it('should have an instance method to return sensors as array', () => {
        var obj = new ObjectModel();
        expect(obj.getSensorArray).to.be.a("function");
        expect(obj.getSensorArray()).to.be.a(Array);
        expect(obj.getSensorArray().length).to.equal(0);
        
        obj.sensors.testsensor = {name: "testsensor", quality: 0.3, url: "http://sensorurl.local"};
        expect(obj.getSensorArray()).to.be.a(Array);
        expect(obj.getSensorArray().length).to.equal(1);
    });


});
