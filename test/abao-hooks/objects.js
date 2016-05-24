var hooks = require('hooks');
var chai = require('chai')
    , expect = chai.expect
    , should = chai.should();

hooks.after('GET /objects -> 200', function (test, done) {
    object = test.response.body[0];
    expect(object).to.be.a("object");
    done();
});