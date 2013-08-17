var assert = require('assert');
var sinon = require('sinon');
var support = require('../support');
var UncaughtExceptionHandler = main.server.UncaughtExceptionHandler;

describe("UncaughtExceptionHandler", function () {
    describe("instantiating", function () {
        it("sets self.app_name", function () {
            var app_name = support.random.string();
            var handler = new UncaughtExceptionHandler({app_name: app_name});
            assert.strictEqual(handler.app_name, app_name);
        });

        it("sets self.app_name to '' by default", function () {
            var handler = new UncaughtExceptionHandler();
            assert.strictEqual(handler.app_name, '');
        });
    });

    describe("handle()", function () {
        var handler;
        var app_name;
        var error;
        var req = {};
        var res = {
            header: function () {},
            status: function () {},
            json: function () {}
        };

        var route = {spec: {method: 'POST', path: '/foo/bar'}};

        beforeEach(function () {
            app_name = support.random.string();
            handler = new UncaughtExceptionHandler({app_name: app_name});
            error = support.fake_error();
        });

        context("whe no error passed in", function () {
            it("doesn't log to console", function () {
                sinon.stub(console, 'log');

                handler.handle(req, res, route);
                assert.ok(!console.log.called);

                console.log.restore();
            });
        });

        it("logs meta info to the console", function () {
            sinon.stub(console, 'log');

            handler.handle(req, res, route, error);
            var expected = /\[app\].*uncaught exception/i;
            assert.ok(console.log.calledWithMatch(expected));

            console.log.restore();
        });

        it("logs route info to the console", function () {
            sinon.stub(console, 'log');

            handler.handle(req, res, route, error);
            var expected = 'Route: ' + route.spec.method + ' ' + route.spec.path;
            assert.ok(console.log.calledWith(expected));

            console.log.restore();
        });

        it("doesn't log route info if no route passed in", function () {
            sinon.stub(console, 'log');

            handler.handle(req, res, null, error);
            var route_regex = /Route/;
            assert.ok(!console.log.calledWithMatch(route_regex));

            console.log.restore();
        });

        it("logs error to the console", function () {
            sinon.stub(console, 'log');

            handler.handle(req, res, route, error);
            assert.ok(console.log.calledWith(error));

            console.log.restore();
        });

        it("logs error's stack to the console", function () {
            sinon.stub(console, 'log');

            handler.handle(req, res, route, error);
            assert.ok(console.log.calledWith(error.stack));

            console.log.restore();
        });

        it("doesn't throw an error when no app_name is set", function () {
            sinon.stub(console, 'log');
            handler = new UncaughtExceptionHandler();

            handler.handle(req, res, route, error);
            assert.ok(console.log.calledWith(error));

            console.log.restore();
        });

        it("calls res.json() with error", function () {
            sinon.stub(console, 'log');
            sinon.stub(res, 'json');

            handler.handle(req, res, route, error);
            assert.ok(res.json.calledWith(error));

            res.json.restore();
            console.log.restore();
        });
    });
});
