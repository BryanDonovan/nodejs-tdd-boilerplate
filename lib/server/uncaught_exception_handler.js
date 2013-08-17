/**
 * Handler for exceptions that are not handled by the application code.
 * @class
 * @see AppServer
 */

function UncaughtExceptionHandler(args) {
    args = args || {};
    var self = this;
    self.app_name = args.app_name || '';
}

UncaughtExceptionHandler.prototype.handle = function (req, res, route, err) {
    var self = this;

    if (err) {
        var msg = '[app] ';
        if (self.app_name) {
            msg += self.app_name + ' ';
        }
        msg += 'uncaught exception';

        console.log(msg);

        if (route && route.spec) {
            console.log('Route: ' + route.spec.method + ' ' + route.spec.path);
        }

        console.log(err);
        console.log(err.stack);

        res.header('Content-Type', 'application/json; charset=utf-8');
        res.charSet = "utf-8";
        res.status(500);
        res.json(err);
    }
};

module.exports = UncaughtExceptionHandler;
