var convict = require('convict');

// Define a schema
var conf = convict({
    env: {
        doc: "The applicaton environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV"
    },
    port: {
        doc: "port on which the server should listen",
        fomrat: "int",
        default: 9000,
        env: "CTX_MGR_PORT"
    },
    amqp: {
        url: {
            doc: "The amqp connection URL for the AMQP broker to use.",
            format: String,
            default: "amqp://localhost",
            env: "AMQP_URL"
        },
        contextExchange: {
            doc: "name opf the amqp exchange where context information should be published (pub/sub style)",
            format: String,
            default: "context",
            env: "AMQP_CONTEXT_EXCHANGE"
        }
    },
    redis: {
        host: {
            doc: "redis host",
            format: String,
            default: "127.0.0.1",
            env: "REDIS_HOST"
        },
        port: {
            doc: "redis port",
            format: "int",
            default: 6379,
            env: "REDIS_PORT"
        },
        database: {
            doc: "redis database number to use",
            default: 0,
            env: "REDIS_DB"
        },
        password: {
            doc: "redis password",
            default: null,
            env: "REDIS_PW"
        }
    },
    mongodb: {
        host: {
            doc: "MongoDB host",
            format: String,
            default: "127.0.0.1",
            env: "MONGO_HOST"
        },
        port: {
            doc: "MongoDB port",
            format: "int",
            default: 27017,
            env: "MONGO_PORT"
        },
        database: {
            doc: "MongoDB Database",
            default: "sitopt-ctx-mgr",
            env: "MONGO_DB"
        },
        user: {
            doc: "MongoDB user",
            default: null,
            env: "MONGO_USER"
        },
        password: {
            doc: "MongoDB connection password",
            default: null,
            env: "MONGO_PW"
        }
    }
});

// Load environment dependent configuration
var env = conf.get('env');
try {
    conf.loadFile('./config/' + env + '.json');
} catch(e) {
    // no config file present, will use defaults
}


// Perform validation
conf.validate({strict: true});

module.exports = conf;