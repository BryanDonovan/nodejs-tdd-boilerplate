var assert = require('assert');
var support = require('../../support');

describe("Feature: User creation", function() {
    var http_client;

    before(function() {
        http_client = support.http.client();
    });

    context("Scenario: using a username and password", function() {
        context("Given a username does not already exist", function() {
            context("When an API client POSTs to /users with a valid username and password", function() {
                var response;

                before(function(done) {
                    var params = {
                        username: support.random.string(),
                        password: support.random.string()
                    };

                    http_client.post('/users', params, function(err, result) {
                        assert.ifError(err);
                        result = response;
                        done();
                    });
                });

                it("Then the response code should be 200", function() {
                    assert.strictEqual(response.statusCode, 200);
                });

                it("And the response data should include the user's ID", function(done) {
                    assert.ok(response.data.id);
                });
            });
        });
    });
});
