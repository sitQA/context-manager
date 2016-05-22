var mongoPackage = require('mongodb');
var conf = require('../config/appConf');

var mongo = function (api, next) {

    api.mongo = {};
    api.mongo.client = {};
    api.mongo.enable = api.config.mongo.enable;
    api.mongo.client = mongoPackage.MongoClient;


    var credentials = "";
    if (conf.get("mongodb.user")) {
        credentials = conf.get("mongodb.user") + ":" + conf.get("mongodb.password") + "@";
    }
    var url = 'mongodb://' + credentials + conf.get('mongodb.host') + ':' + conf.get('mongodb.port') + '/' + conf.get('mongodb.database');

    api.mongo.client.connect(url, function (err, db) {
        if (err) {
            api.log(err + "error in mongoDB connection", "notice");
            next();
        } else {

            api.log("mongoDB connection ok ", "notice");
            api.mongo.db = db;
            next();
        }
    });

};


exports.mongo = mongo;