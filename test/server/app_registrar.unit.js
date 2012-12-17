var assert = require('assert');
var restify = require('restify');
var sinon = require('sinon');
var support = require('../support');
var path = require('path');
var AppRegistrar = main.server.AppRegistrar;

var settings_path = path.join(__dirname, '..', 'support', 'data', 'fake_app_settings.js');
var empty_settings_path = path.join(__dirname, '..', 'support', 'data', 'empty_app_settings.js');

describe("app_registrar.js", function () {
    var server;

    beforeEach(function () {
        server = restify.createServer({
            name: 'test'
        });

        server.listen(support.http.port);
    });

    afterEach(function (done) {
        setTimeout(function () {
            server.close();
            done();
        }, 10);
    });

    describe("instantiating", function () {
        context("when server missing", function () {
            it("throws an error", function () {
                assert.throws(function () {
                    var registrar = new AppRegistrar(null, 'users');
                }, /AppRegistrar.*server/);
            });
        });

        context("when app_name not found in apps path", function () {
            it("throws an error", function () {
                assert.throws(function () {
                    var registrar = new AppRegistrar(server, 'foo');
                }, /AppRegistrar.*app not found/);
            });
        });
    });

    describe("instance methods", function () {
        var registrar;

        describe("register()", function () {
            context("when server and app_name are valid", function () {
                it("does not throw error", function (done) {
                    registrar = new AppRegistrar(server, 'users');
                    registrar.register();

                    setTimeout(function () {
                        assert.ok(true);
                        done();
                    }, 10);
                });
            });
        });
    });
});
