var amqp = require('amqplib/callback_api');
var conf = require('../config/conf');

var channel = null;
var ex = conf.get('amqp.contextExchange');

var connect = function(callback) {
    amqp.connect(conf.get('amqp.url'), function(err, conn) {
        if(err) {
            console.log(err);
            process.exit(1);
        } else {
            conn.createChannel(function(err, ch) {
                if(err) throw err;
                ch.assertExchange(ex, 'topic', {durable: false});
                channel = ch;
                callback();
                console.log("connected to amqp broker");
            });
        }
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