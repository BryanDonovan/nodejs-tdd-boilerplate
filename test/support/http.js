var restify = require('restify');
var host = process.env.HOST || 'localhost';
var port = process.env.PORT;

if (!port) {
    if (host === 'localhost') {
        port = '8080';
    } else {
        port = '80';
    }
}

function TestServer(args) {
    this.routes = args.routes;
    this.server = restify.createServer();
    this.server.use(restify.bodyParser());
    this.server.use(restify.queryParser());
    main.server.router.register_routes(this.server, this.routes);
}

TestServer.prototype.start = function () {
    if (this.server) {
        this.server.listen(port, host);
    } else {
        throw new Error('Server not found');
    }
};

TestServer.prototype.stop = function () {
    this.server.close();
};

function HttpClient(args) {
    args = args || {};
    if (!args.host) {
        throw new Error('HTTP Client requires a host param');
    }

    this.host = args.host;
    this.protocol = args.protocol || 'http';
    this.port = args.port;
    this.url = 'http://' + this.host + ':' + this.port;

    if (args.type === 'string') {
        this.client = restify.createStringClient({url: this.url});
    } else {
        this.client = restify.createJsonClient({url: this.url});
    }
}

HttpClient.prototype.get = function (path_or_options, cb) {
    this.client.get(path_or_options, function (err, req, res, data) {
        cb(err, data, res, req);
    });
};

HttpClient.prototype.get_plain = function (path_or_options, cb) {
    this.string_client.get(path_or_options, function (err, req, res, data) {
        cb(err, data, res, req);
    });
};

HttpClient.prototype.post = function (path_or_options, body, cb) {
    this.client.post(path_or_options, body, function (err, req, res, data) {
        cb(err, data, res, req);
    });
};

HttpClient.prototype.put = function (path_or_options, body, cb) {
    this.client.put(path_or_options, body, function (err, req, res, data) {
        cb(err, data, res, req);
    });
};

HttpClient.prototype.del = function (path_or_options, cb) {
    this.client.del(path_or_options, function (err, req, res, data) {
        cb(err, data, res, req);
    });
};

var http = {
    string_client: function () {
        return new HttpClient({host: host, port: port, type: 'string'});
    },

    client: function () {
        return new HttpClient({host: host, port: port});
    },

    server: {
        create: function (routes) {
            return new TestServer({routes: routes});
        }
    },

    host: host,
    port: port
};

module.exports = http;

