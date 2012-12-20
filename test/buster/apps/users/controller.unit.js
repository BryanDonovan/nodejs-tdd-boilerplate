var buster = require('buster');
buster.spec.expose(); // Make spec functions global
var assert = buster.assert;

var restify = require('restify');
var support = require('../../../support');
var http = support.http;
var User = main.models.User;

var spec = describe("users/controller.js", function () {
    var app;
    var http_client;

    beforeAll(function () {
        http_client = http.client();
        app = main.app();
        app.register('users', {port: http.port});
    });

    afterAll(function () {
        app.close_server();
    });

    describe("POST /users", function () {
        var params;

        beforeEach(function () {
            params = {username: support.random.string(), password: support.random.string()};
        });

        it("passes params to User model", function (done) {
            this.stub(User, 'create', function (args, cb) {
                cb(null, {});
            });

            http_client.post('/users', params, function (err, result) {
                buster.refute(err);
                assert(User.create.calledWith(params));
                assert(true);
                User.create.restore();
                done();
            });
        });

        describe("when model returns an error", function () {
            it("responds with the error", function (done) {
                var fake_err = new restify.InvalidArgumentError('foo');
                this.stub(User, 'create', function (args, cb) {
                    cb(fake_err, {});
                });

                http_client.post('/users', params, function (err, result) {
                    assert(User.create.calledWith(params));
                    assert.equals(result.code, 'InvalidArgument');
                    assert.equals(result.message, 'foo');
                    User.create.restore();
                    done();
                });
            });
        });
    });
});
