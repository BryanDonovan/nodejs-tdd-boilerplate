var assert = require('assert');
var sinon = require('sinon');
var support = require('../support');
var responder = main.server.responder;

var fake_res = {
    header: function () {},
    status: function () {},
    json: function () {},
    send: function () {}
};

var fake_req = {
    headers: {
        host: 'local.foo.com'
    }
};

var fake_next = function () {};


describe("responder.js", function () {
    describe("error()", function () {
        it("calls next() with error", function () {
            var called = false;
            fake_next = function () {
                called = true;
            };

            responder.error(null, 'foo', fake_next);

            assert.ok(called);
        });
    });

    describe("success()", function () {
        context("when no res is passed in", function () {
            it("throws an error", function () {
                assert.throws(function () {
                    responder.success(null, 'foo', fake_next);
                }, /No res passed/);
            });
        });

        context("when no data passed in", function () {
            it("calls responder.error()", function (done) {
                sinon.stub(responder, 'error', function (res, err, next) {
                    next();
                });

                responder.success(fake_res, null, fake_next);

                assert.ok(responder.error.called);

                responder.error.restore();
                done();
            });
        });

        context("when no data is not an object", function () {
            it("it converts data to an empty object", function (done) {
                var mock = sinon.mock(fake_res);
                mock.expects('json').withArgs({});

                responder.success(fake_res, 'foo', fake_next);

                mock.verify();
                mock.restore();
                done();
            });
        });
    });

    describe("redirect()", function () {
        var args;

        beforeEach(function () {
            args = {url: '/foo/bar'};
        });

        context("when no args passed in", function () {
            it("responds with an InternalError", function (done) {
                sinon.stub(responder, 'error', function (res, err, next) {
                    next();
                });

                responder.redirect(fake_req, fake_res, null, fake_next);

                assert.ok(responder.error.called);

                responder.error.restore();
                done();
            });
        });

        context("when args.user not passed in", function () {
            it("responds with an InternalError", function (done) {
                sinon.stub(responder, 'error', function (res, err, next) {
                    next();
                });

                delete args.url;
                responder.redirect(fake_req, fake_res, args, fake_next);

                assert.ok(responder.error.called);

                responder.error.restore();
                done();
            });
        });

        context("when request's protocol is https", function () {
            it("redirects with https protocol", function () {
                sinon.stub(fake_res, 'header');

                var https_req = support.shallow_clone(fake_req);
                https_req.headers['x-forwarded-proto'] = 'https';
                var args = {url: '/foo/bar'};

                responder.redirect(https_req, fake_res, args, fake_next);

                assert.ok(fake_res.header.calledWith('Location', "https://local.foo.com/foo/bar"));

                fake_res.header.restore();
            });
        });
    });
});
