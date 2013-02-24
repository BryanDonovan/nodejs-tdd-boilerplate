var restify = require('restify');

var responder = {
    error: function (res, err, next) {
        next(err);
    },

    success: function (res, data, next) {
        if (!res) {
            var msg = "No res passed into responder.success()";
            throw new Error(msg);
        }

        if (!data) {
            return responder.error(res, new restify.InternalError("missing data"), next);
        }

        if (typeof data !== 'object') {
            data = {};
        }

        res.header('Content-Type', 'application/json; charset=utf-8');
        res.charSet = "utf-8";
        res.status(200);
        res.json(data);
        next();
    },

    respond: function (res, err, data, next) {
        if (err || !data) {
            responder.error(res, err, next);
        } else {
            responder.success(res, data, next);
        }
    }
};

module.exports = responder;
