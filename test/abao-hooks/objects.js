var hooks = require('hooks');
var chai = require('chai')
    , expect = chai.expect
    , should = chai.should();

hooks.after('GET /objects -> 200', function (test, done) {
    obj = test.response.body[0];
    expect(obj).to.be.a("object");
    done();
});

hooks.before('GET /objects/{objectId} -> 200', function (test, done) {
    test.request.params = {objectId: "t1"};
    done();
});

hooks.after('GET /objects/{objectId} -> 200', function(test, done) {
    obj = test.response.body;
    console.log(test.response);
    expect(obj).to.be.a("object");
    done();
});

hooks.before('GET /objects/{objectId} -> 404', function (test, done) {
    test.request.params = {objectId: "id not present in db"};
    done();
});

hooks.after('GET /objects/{objectId} -> 404', function(test, done) {
    obj = test.response.body;
    expect(obj).to.be.a("object");
    done();
});