var assert = require('assert');
var restify = require('restify');
var support = require('../support');
var http = support.http;
var responder = main.server.responder;

var methods = {
    get_restify_error: function (req, res, next) {
        var error = new restify.InvalidArgumentError('foo arg invalid');
        return responder.error(res, error, next);
    },

    redirect_to_full_url: function (req, res, next) {
        var args = {url: 'http://google.com'};
        return responder.redirect(req, res, args, next);
    },

    redirect_to_full_url_301: function (req, res, next) {
        var args = {url: 'http://google.com', status: 301};
        return responder.redirect(req, res, args, next);
    },

    redirect_to_full_path: function (req, res, next) {
        var args = {url: '/foo/bar'};
        return responder.redirect(req, res, args, next);
    },

    redirect_to_full_path_without_leading_slash: function (req, res, next) {
        var args = {url: 'foo/bar'};
        return responder.redirect(req, res, args, next);
    },

    redirect_to_relative_path: function (req, res, next) {
        var args = {url: './foo/bar'};
        return responder.redirect(req, res, args, next);
    }
};

var routes = [
    {
        method: "get",
        url: "/test/errors/restify",
        func: methods.get_restify_error,
        middleware: []
    },
    {
        method: "get",
        url: "/test/redirects/full_url",
        func: methods.redirect_to_full_url,
        middleware: []
    },
    {
        method: "get",
        url: "/test/redirects/full_url_301",
        func: methods.redirect_to_full_url_301,
        middleware: []
    },
    {
        method: "get",
        url: "/test/redirects/full_path",
        func: methods.redirect_to_full_path,
        middleware: []
    },
    {
        method: "get",
        url: "/test/redirects/full_path_without_leading_slash",
        func: methods.redirect_to_full_path_without_leading_slash,
        middleware: []
    },
    {
        method: "get",
        url: "/test/redirects/relative_path",
        func: methods.redirect_to_relative_path,
        middleware: []
    }
];

describe("functional - server/responder.js", function () {
    var server;
    var http_client;
    var http_string_client;

    before(function () {
        server = http.server.create(routes);
        server.start();
        http_client = http.client();
        http_string_client = http.string_client();
    });

    after(function () {
        server.stop();
    });

    describe("error responses", function () {
        describe("restify errors", function () {
            it("returns correct response body", function (done) {
                http_client.get('/test/errors/restify', function (err, result) {
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

    describe("redirect()", function () {
        context("when full URL passed in", function () {
            context("and no status passed in", function () {
                it("redirects to the full URL with status 302", function (done) {
                    http_client.get('/test/redirects/full_url', function (err, result, raw_res) {
                        assert.equal(raw_res.headers.location, 'http://google.com');
                        assert.equal(raw_res.statusCode, 302);
                        done();
                    });
                });
            });

            context("and status 301 passed in", function () {
                it("redirects to the full URL with status 301", function (done) {
                    http_client.get('/test/redirects/full_url_301', function (err, result, raw_res) {
                        assert.equal(raw_res.headers.location, 'http://google.com');
                        assert.equal(raw_res.statusCode, 301);
                        done();
                    });
                });
            });
        });

        context("when full path passed in without host and port", function () {
            it("redirects to the correct URL using request's host and port", function (done) {
                http_client.get('/test/redirects/full_path', function (err, result, raw_res) {
                    var expected_location = 'http://' + http.host + ':' + http.port + '/foo/bar';
                    assert.equal(raw_res.headers.location, expected_location);
                    assert.equal(raw_res.statusCode, 302);
                    done();
                });
            });
        });

        context("when full path passed in without leading slash", function () {
            it("returns Internal error", function (done) {
                http_client.get('/test/redirects/full_path_without_leading_slash', function (err) {
                    assert.equal(err.body.code, 'InternalError');
                    assert.ok(err.message.match(/leading slash/));
                    done();
                });
            });
        });

        context("when relative path passed in", function () {
            it("redirects to the correct URL using request's host and port", function (done) {
                var starting_path = '/test/redirects/relative_path';
                http_client.get(starting_path, function (err, result, raw_res) {
                    var expected_location = 'http://' + http.host + ':' + http.port + starting_path + '/foo/bar';
                    assert.equal(raw_res.headers.location, expected_location);
                    assert.equal(raw_res.statusCode, 302);
                    done();
                });
            });
        });
    });
});
