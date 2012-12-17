var path = require('path');
var lib_dir = path.resolve(__dirname, '../');
var router = require('./router');
var ENV = process.env.NODE_ENV;

function AppRegistrar(server, app_name, options) {
    options = options || {};
    var self = this;
    self.server = server;
    self.app_path = path.join(lib_dir, 'apps', app_name);
}

AppRegistrar.prototype.register = function () {
    var self = this;
    var routes = require(path.join(self.app_path, 'routes'));
    if (routes) {
        //log.debug("register routes for: " + app_name);
        router.register_routes(self.server, routes);
    }
};

module.exports = AppRegistrar;
