var path = require('path');
var restify = require('restify');
var Logger = require('bunyan');
var UncaughtExceptionHandler = require('./uncaught_exception_handler');

var ENV = process.env.NODE_ENV;

var log_path = path.resolve(__dirname, '..', '..', 'log', ENV + '.log');
var logger = new Logger({
    name: 'app',
    streams: [
        {
            path: log_path,
            level: 'debug'
        }
    ]
});

function AppServer(config) {
    var self = this;
    self.config = config;
    self.started = false;
    if (!config) { throw new Error("AppServer requires a config object"); }

    var app_name = self.config.app_name || 'MyApi';

    var uncaught_exception_handler = new UncaughtExceptionHandler({app_name: app_name});

    self.server = restify.createServer({
        name: app_name,
        log: logger
    });

    self.server.on('after', restify.auditLogger({
        name: 'audit',
        log: logger
    }));

    self.server.on('uncaughtException', uncaught_exception_handler.handle);

    process.on('SIGHUP', function () { process.exit(); });
}

AppServer.prototype.start = function (options) {
    options = options || {};
    var self = this;
    var port = options.port || self.config.server.port;

    self.server.listen(parseInt(port, 10));

    self.server.use(restify.bodyParser());
    self.server.use(restify.queryParser());

    self.started = true;
};


AppServer.prototype.close = function () {
    var self = this;
    if (self.started) {
        self.server.close();
        self.started = false;
    }
};

module.exports = AppServer;
