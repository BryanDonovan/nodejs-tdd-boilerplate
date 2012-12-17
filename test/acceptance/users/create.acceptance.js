var assert = require('assert');
var support = require('../../support');

describe("Feature: User creation", function () {
    var http_client;

    before(function () {
        http_client = support.http.client();
    });

    context("Scenario: using a username and password", function () {
        context("Given a username does not already exist", function () {
            context("When an API client POSTs to /users with a valid username and password", function () {
                var response;
                var raw_res;

                before(function (done) {
                    var params = {
                        username: support.random.string(),
                        password: support.random.string()
                    };

                    http_client.post('/users', params, function (err, result, raw) {
                        assert.ifError(err);
                        response = result;
                        raw_res = raw;
                        done();
                    });
                });

                it("Then the response code should be 200", function () {
                    assert.strictEqual(raw_res.statusCode, 200);
                });

                it("And the response data should include the user's ID", function () {
                    assert.ok(response.data.id);
                });
            });
        });
    });
});
