var restify = require('restify');
var Logger = require('bunyan');

var ENV = process.env.NODE_ENV;

function AppServer(config, options) {
    var self = this;
    self.config = config;
    self.started = false;

    //var uncaught_exception_handler = require('./uncaught_exception_handler')({app_name: app_name});
    if (!config) { throw new Error("AppServer requires a config object"); }

    self.server = restify.createServer({
        name: config.app_name || 'MyApi'
    });

    self.server.on('after', restify.auditLogger({
        log: new Logger({
            name: 'audit',
            stream: process.stdout
        })
    }));


    //self.logger = self.server.Logger;

    //process.on('uncaughtException', uncaught_exception_handler.handle);
    process.on('SIGHUP', function () {
        process.exit();
    });
}

AppServer.prototype.start = function (options) {
    options = options || {};
    var self = this;
    var port = options.port;

    //self.logger.debug("Started with ENV: " + ENV);

    port = port || self.config.server.port;

    self.server.listen(parseInt(port, 10));
    //self.logger.debug("Server Listening on Port: " + port);

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
