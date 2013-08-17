var User = main.models.User;
var responder = main.server.responder;

var methods = {
    create: function (req, res, next) {
        //throw new Error('foo');
        User.create(req.params, function (err, user) {
            responder.respond(res, err, {data: user}, next);
        });
    }
};

module.exports = methods;
