var Settings = require('settings');
var config = new Settings(require('../config'));
var AppServer = require('./server/app_server');
var AppRegistrar = require('./server/app_registrar');

var app = function () {
    var self = {};

    self.app_server = new AppServer(config);

    self.register = function (app_name, options) {
        if (!self.app_server.started) {
            self.app_server.start(options);
        }

        var registrar = new AppRegistrar(self.app_server.server, app_name, options);
        registrar.register();
    };

    self.close_server = function () {
        if (self.app_server.started) {
            self.app_server.close();
            self.app_server.started = false;
        }
    };

    return self;
};

module.exports = app;
