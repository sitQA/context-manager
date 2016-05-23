var mongoose = require('mongoose');
var conf = require('../config/conf');

var db;
var connect = function(next){
    var credentials = "";
    if (conf.get("mongodb.user")) {
        credentials = conf.get("mongodb.user") + ":" + conf.get("mongodb.password") + "@";
    }
    var url = 'mongodb://' + credentials + conf.get('mongodb.host') + ':' + conf.get('mongodb.port') + '/' + conf.get('mongodb.database');

    mongoose.connect(url);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        next(db)
    });
};


module.exports = {
    connect: connect
};