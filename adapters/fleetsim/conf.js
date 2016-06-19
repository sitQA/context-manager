var convict = require('convict');

// Define a schema
var conf = convict({
    env: {
        doc: "The applicaton environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV"
    },
    trafficService: {
        doc: "url of the traffic service which is part of the fleetsim project",
        format: "String",
        default: "http://localhost:8080/api/v1/simulations/demo/trafficservice",
        env: "FLEETSIM_TRAFFICSERVICE_URL"
    }
});

// Load environment dependent configuration
var env = conf.get('env');
try {
    conf.loadFile('./config/fleetsim/' + env + '.json');
} catch(e) {
    // no config file present, will use defaults
}


// Perform validation
conf.validate({strict: true});

module.exports = conf;