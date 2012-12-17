var fs = require('fs');
var path = require('path');
var lib_dir = path.resolve(__dirname, '../');
var router = require('./router');

function AppRegistrar(server, app_name) {
    this.server = server;
    if (!this.server) {
        throw new Error('AppRegistrar requires a server instance');
    }

    this.app_path = path.join(lib_dir, 'apps', app_name);
    if (!fs.existsSync(this.app_path)) {
        throw new Error('AppRegistrar: app not found at path ' + this.app_path);
    }
}

AppRegistrar.prototype.register = function () {
    var routes = require(path.join(this.app_path, 'routes'));
    router.register_routes(this.server, routes);
};

module.exports = AppRegistrar;
