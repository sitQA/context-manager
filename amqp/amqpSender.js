var amqp = require('amqplib/callback_api');
var logger = require('morgan');

var channel = null;
var ex = 'sensorvalues';

var connect = function(callback) {
    amqp.connect('amqp://localhost', function(err, conn) {
        conn.createChannel(function(err, ch) {
            ch.assertExchange(ex, 'topic', {durable: false});
            channel = ch;
            callback();
            console.log("connected to amqp broker");
        });
    });
};

/**
 *
 * @param sensorValue object to be published
 * @param objectId will be used to compose the routing key
 * @param sensorId will be used to compose the routing key
 */
var publish = function(sensorValue, objectId, sensorId) {
    if(channel === null) {
        console.log("could not publish sensor value via AMQP. Not connected to broker.");
    }
    var key = objectId + '.' + sensorId;
    channel.publish(ex, key, new Buffer(JSON.stringify(sensorValue)));
};


module.exports = {
    "publish" : publish,
    "connect" : connect
};