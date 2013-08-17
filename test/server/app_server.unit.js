var assert = require('assert');
require('../support');
var Settings = require('settings');
var config = new Settings(require('../../config'));
var AppServer = main.server.AppServer;

describe('app_server.js', function () {
    describe("instantiating", function () {
        context("when config is not passed in", function () {
            it("throws an error", function () {
                assert.throws(function () {
                    new AppServer(null);
                }, /AppServer.*config/);
            });
        });
    });

    describe("start()", function () {
        context("with no args", function () {
            it("starts the server", function (done) {
                var new_server = new AppServer(config);
                new_server.start();
                setTimeout(function () {
                    assert.ok(new_server.server.server._handle);
                    new_server.close();
                    done();
                }, 20);
            });
        });
    });

    describe("close()", function () {
        context("when server has been started", function () {
            it("closes the server", function (done) {
                var new_server = new AppServer(config);

                new_server.start();

                setTimeout(function () {
                    assert.ok(new_server.server.server._handle);

                    new_server.close();
                    setTimeout(function () {
                        assert.strictEqual(new_server.server.server._handle, null);
                        done();
                    }, 10);
                }, 30);
            });
        });

        context("when server hasn't been started", function () {
            it("doesn't blow up", function (done) {
                var new_server = new AppServer(config);

                setTimeout(function () {
                    new_server.close();
                    setTimeout(function () {
                        done();
                    }, 10);
                }, 10);
            });
        });

        context("when server has already been closed", function () {
            it("doesn't blow up", function (done) {
                var new_server = new AppServer(config);

                new_server.start();

                setTimeout(function () {
                    new_server.close();

                    setTimeout(function () {
                        new_server.close();

                        setTimeout(function () {
                            done();
                        }, 10);
                    }, 10);
                }, 10);
            });
        });
    });
});
