var restify = require('restify');
var util = require('util');

var responder = {
    error: function (res, err, next) {
        next(err);
        /*
        options = options || {};

        if (!res) {
            var msg = "No res passed into responder.error()";
            throw new Error(msg);
        }

        res.header('Content-Type', 'application/json; charset=utf-8');
        res.charSet = "utf-8";
        res.status(formatted_error.status_code);
        delete formatted_error.status_code;
        res.mog_response = formatted_error;
        res.json(formatted_error);
        next();
        */
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
