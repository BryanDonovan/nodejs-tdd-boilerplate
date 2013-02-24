var assert = require('assert');
var User = main.models.User;

describe("User model", function () {
    describe("create()", function () {
        it("returns dummy result for now", function (done) {
            User.create({id: 'foo'}, function (err, result) {
                assert.ifError(err);
                assert.ok(result);
                done();
            });
        });
    });
});
