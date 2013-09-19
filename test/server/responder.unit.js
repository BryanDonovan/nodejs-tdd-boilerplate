var assert = require('assert');
var fs = require('fs');
var sinon = require('sinon');
var support = require('../support');
var responder = main.server.responder;

var fake_res = {
    header: function () {},
    status: function () {},
    json: function () {},
    send: function () {},
    setHeader: function () {}
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

        context("when args.url not passed in", function () {
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

    describe("download()", function () {
        var args;

        beforeEach(function () {
            args = {
                filename: 'foo.js',
                contentType: 'application/javascript',
                stream: fs.createReadStream(__filename),
                contentLength: 2000

            };
        });

        context("when no args passed in", function () {
            it("responds with an InternalError", function (done) {
                sinon.stub(responder, 'error', function (res, err, next) {
                    next();
                });

                responder.download(fake_res, null, fake_next);

                assert.ok(responder.error.called);

                responder.error.restore();
                done();
            });
        });

        context("when args.filename not passed in", function () {
            it("responds with an InternalError", function (done) {
                sinon.stub(responder, 'error', function (res, err, next) {
                    next();
                });

                delete args.filename;
                responder.download(fake_res, args, fake_next);

                assert.ok(responder.error.called);

                responder.error.restore();
                done();
            });
        });

        context("when args.stream not passed in", function () {
            it("responds with an InternalError", function (done) {
                sinon.stub(responder, 'error', function (res, err, next) {
                    next();
                });

                delete args.stream;
                responder.download(fake_res, args, fake_next);

                assert.ok(responder.error.called);

                responder.error.restore();
                done();
            });
        });

        context("when args.contentType not passed in", function () {
            it("responds with Content-Type header set to application/octet-stream", function (done) {
                sinon.spy(fake_res, 'setHeader');
                sinon.stub(args.stream, 'pipe', function () { });

                delete args.contentType;
                responder.download(fake_res, args, fake_next);

                assert.ok(fake_res.setHeader.calledWith('Content-Type', 'application/octet-stream'));

                fake_res.setHeader.restore();
                args.stream.pipe.restore();
                done();
            });
        });

        context("when args.contentLength not passed in", function () {
            it("responds without Content-Length header set", function (done) {
                sinon.spy(fake_res, 'setHeader');
                sinon.stub(args.stream, 'pipe', function () { });

                delete args.contentLength;
                responder.download(fake_res, args, fake_next);

                assert.ok(!fake_res.setHeader.calledWith('Content-Length'));

                fake_res.setHeader.restore();
                args.stream.pipe.restore();
                done();
            });
        });

        context("when args passed in correctly", function () {
            it("responds without 200 status and content", function (done) {
                sinon.spy(fake_res, 'setHeader');
                sinon.spy(fake_res, 'status');
                sinon.stub(args.stream, 'pipe', function () { });

                responder.download(fake_res, args, fake_next);

                assert.ok(fake_res.setHeader.calledWith('Content-Type', 'application/javascript'));
                assert.ok(fake_res.setHeader.calledWith('Content-Length', 2000));
                assert.ok(fake_res.setHeader.calledWith('Content-Disposition', 'attachment; filename=foo.js'));
                assert.ok(fake_res.status.calledWith(200));
                assert.ok(args.stream.pipe.calledWith(fake_res));

                fake_res.setHeader.restore();
                args.stream.pipe.restore();
                done();
            });
        });
    });
});
