var assert = require('assert');
var sinon = require('sinon');
var support = require('../../support');
var http = support.http;
var User = main.models.User;

describe("users/controller.js", function () {
    var app;
    var http_client;

    before(function () {
        http_client = http.client();
        app = main.app();
        app.register('users', {port: http.port});
    });

    after(function () {
        app.close_server();
    });

    describe("POST /users", function () {
        it("passes params to User model", function (done) {
            sinon.stub(User, 'create', function (args, cb) {
                cb(null, {});
            });

            var params = {username: support.random.string(), password: support.random.string()};

            http_client.post('/users', params, function (err, result) {
                assert.ifError(err);
                assert.ok(User.create.calledWith(params));
                done();
            });
        });
    });
});
