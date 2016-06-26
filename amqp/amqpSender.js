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
 * @param message object to be published
 * @param routingKey string for routing in the form "foo.bar.baz"
 */
var publish = function(message, routingKey) {
    if(channel === null) {
        console.log("could not publish sensor value via AMQP. Not connected to broker.");
    }
    channel.publish(ex, routingKey, new Buffer(JSON.stringify(message)));
};


module.exports = {
    "publish" : publish,
    "connect" : connect
};