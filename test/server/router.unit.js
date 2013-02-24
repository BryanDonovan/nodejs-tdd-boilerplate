/*jshint unused:false*/
var assert = require('assert');
var restify = require('restify');
var support = require('../support');
var router = main.server.router;
var TEST_HOST = support.http.host;
var TEST_PORT = support.http.port;

var fake_middleware = function (req, res, next) {
    return next();
};

var methods = {
    foo: function (req, res, next) {},
    bar: function (req, res, next) {}
};

describe("server/router.js", function () {
    var server;
    var routes;

    beforeEach(function (done) {
        routes = [
            {
                method: "get",
                url: "/test/foo",
                func: methods.foo,
                middleware: [fake_middleware]
            },
            {
                method: "get",
                url: "/test/bar",
                func: methods.bar
            }
        ];

        server = restify.createServer();
        server.listen(TEST_PORT, TEST_HOST);
        setTimeout(done, 10);
    });

    afterEach(function (done) {
        setTimeout(function () {
            server.close();
            done();
        }, 10);
    });

    describe("register_routes()", function () {
        it("adds routes to server", function () {
            assert.strictEqual(server.routes.length, 0);
            assert.strictEqual(routes.length, 2);

            router.register_routes(server, routes);

            assert.strictEqual(server.routes.length, 2);
            assert.equal(server.routes[0].url, routes[0].url);
        });

        it("throws error if routes are not an array", function () {
            assert.throws(function () {
                router.register_routes(server, {foo: 'bar'});
            });
        });
    });
});
