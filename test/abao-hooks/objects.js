'use strict';

var hooks = require('hooks');
var chai = require('chai')
    , expect = chai.expect
    , should = chai.should();

const OBJ_ID = 'newObject';

hooks.after('GET /objects -> 200', function (test, done) {
    var obj = test.response.body[0];
    expect(obj).to.be.a("object");
    done();
});


hooks.before('POST /objects -> 201', function (test, done) {
    test.request.body = {objectId: OBJ_ID};
    done();
});

hooks.after('POST /objects/{objectId} -> 201', function(test, done) {
    var obj = test.response.body;
    console.log(obj);
    expect(obj).to.be.a("object");
    expect(obj).to.have.property("_id");
    done();
});


hooks.before('GET /objects/{objectId} -> 200', function (test, done) {
    test.request.params = {objectId: "t1"};
    done();
});

hooks.after('GET /objects/{objectId} -> 200', function(test, done) {
    var obj = test.response.body;
    expect(obj).to.be.a("object");
    done();
});


hooks.before('GET /objects/{objectId} -> 404', function (test, done) {
    test.request.params = {objectId: "id not present in db"};
    done();
});

hooks.after('GET /objects/{objectId} -> 404', function(test, done) {
    var obj = test.response.body;
    expect(obj).to.be.an("object");
    done();
});

hooks.before('DELETE /objects/{objectId} -> 204', function (test, done) {
    test.request.params = {objectId: OBJ_ID};
    done();
});

hooks.after('DELETE /objects/{objectId} -> 204', function(test, done) {
    expect(test.response.body).to.be.null;
    done();
});


hooks.before('POST /objects/{objectId} -> 201', function (test, done) {
    test.request.params = {objectId: "t1"};
    test.request.body = {name: "temp-sensor", id: "identifier", unit: "hPa"};
    done();
});

hooks.after('POST /objects/{objectId} -> 201', function(test, done) {
    expect(test.response.body).to.have.property("_id");
    done();
});

hooks.before('POST /objects/{objectId}/sensors -> 201', function (test, done) {
    test.request.params = {objectId: "t1"};
    test.request.body = {"slug":"tempsensor", "quality": 0.9, "name": "temperaturesensor", "type": "temperature"};
    done();
});

hooks.before('GET /objects/{objectId}/sensors/{sensorId} -> 200', function(test, done) {
    test.request.params = {objectId: "t1", sensorId: "tempsensor"};
    done();
});

hooks.before('DELETE /objects/{objectId}/sensors/{sensorId} -> 204', function(test, done) {
    test.request.params = {objectId: "t1", sensorId: "tempsensor"};
    done();
});

hooks.before('GET /objects/{objectId}/sensors -> 200', function (test, done) {
    test.request.params = {objectId: "t1"};
    done();
});

hooks.before('GET /objects/{objectId}/sensors/{sensorId} -> 200', function(test, done) {
    test.request.params = {objectId: "t1", sensorId: "testsensor1"};
    done();
});

hooks.after('GET /objects/{objectId}/sensors/{sensorId} -> 200', function(test, done) {
    var obj = test.response.body;
    expect(obj).to.be.an("object");
    done();
});

hooks.before('GET /objects/{objectId}/sensors/{sensorId} -> 404', function(test, done) {
    test.request.params = {objectId: "t1", sensorId: "sensor not present"};
    done();
});