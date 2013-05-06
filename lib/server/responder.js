var restify = require('restify');

function is_full_url(url) {
    return url.indexOf('://') !== -1;
}

function is_relative_path(url) {
    return url.indexOf('.') === 0;
}

function is_https(req) {
    return req && req.headers['x-forwarded-proto'] === 'https';
}

function prepend_http_protocol(url, req) {
    if (is_https(req)) {
        return 'https://' + url;
    } else {
        return 'http://' + url;
    }
}

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
    },

    /**
     * Send an HTTP redirect response.
     * @param {Object} args - hash of args:
     *   - url (required): Can be one of the following:
     *      - Full URL with host (and optionally, port).
     *      - Full path relative to this server.
     *      - Relative path, relative to the path being requested.
     *   - status (default 302) - the HTTP status code to use.
     *
     * @example
     *   Say your server's host is http://example.com.
     *     Full URL:
     *        redirect(req, res, {url: 'http://google.com'}, next)
     *        > sets location to 'http://google.com'
     *     Full path:
     *        redirect(req, res, {url: '/foo/bar'}, next)
     *        > sets location to http://example.com/foo/bar
     *     Relative path:
     *        If you request http://example.com/buzz:
     *        redirect(req, res, {url: './foo/bar'}, next)
     *        > sets location to http://example.com/buzz/foo/bar
     *
     * TODO: Maybe change args names to 'url', 'path', and 'relative_path' since paths aren't really URLs.
     * TODO: Maybe allow a body to be set, e.g.
     *       var body = require('http').STATUS_CODES[status] + '. Redirecting to ' + url;
     */
    redirect: function (req, res, args, next) {
        args = args || {};
        var url = args.url;
        var status = args.status || 302;
        var content_type = 'application/json; charset=utf-8'; // maybe allow this as an optional arg?
        if (!args.url) {
            return responder.error(res, new restify.InternalError('Redirect requires url arg'), next);
        }

        if (!is_full_url(url)) {
            var host = req.headers.host;
            if (is_relative_path(url)) {
                url = url.replace(/^./, '');
                url = host + req.path() + url;
            } else if (url.match(/^\//)) {
                url = host + url; // a bit hacky
            } else {
                return responder.error(res, new restify.InternalError('Full-path redirect url requires leading slash (/)'), next);
            }

            url = prepend_http_protocol(url, req);
        }

        res.header('Content-Type', content_type);
        res.header('Location', url);
        res.send(status);
        return next(false);
    }
};

module.exports = responder;
