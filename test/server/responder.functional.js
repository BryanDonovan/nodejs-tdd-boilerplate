var assert = require('assert');
var restify = require('restify');
var sinon = require('sinon');
var support = require('../support');
var http = support.http;
var responder = main.server.responder;

var methods = {
    get_restify_error: function (req, res, next) {
        var error = new restify.InvalidArgumentError('foo arg invalid');
        return responder.error(res, error, next);
    }
};

var routes = [
    {
        method: "get",
        url: "/test/errors/restify",
        func: methods.get_restify_error,
        middleware: []
    }
];

describe("functional - server/responder.js", function () {
    var server;
    var http_client;

    before(function () {
        server = http.server.create(routes);
        server.start();
        http_client = http.client();
    });

    after(function () {
        server.stop();
    });

    describe("error responses", function () {
        describe("restify errors", function () {
            it("returns correct response body", function (done) {
                http_client.get('/test/errors/restify', function (err, result, raw_res) {
                    var expected = {
                        code: 'InvalidArgument',
                        message: 'foo arg invalid'
                    };

                    assert.strictEqual(err.statusCode, 409);
                    assert.deepEqual(result, expected);
                    done();
                });
            });
        });
    });
});
