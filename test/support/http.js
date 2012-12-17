var restify = require('restify');
var util = require('util');
var host = process.env.HOST || 'localhost';
var port = process.env.PORT;
var ENV = process.env.NODE_ENV;

if (!port) {
    if (host === 'localhost') {
        port = '8080';
    } else {
        port = '80';
    }
}

function HttpClient(args) {
    args = args || {};
    if (!args.host) {
        throw new Error('HTTP Client requires a host param');
    }

    this.host = args.host;
    this.protocol = args.protocol || 'http';
    this.port = args.port;
    this.url = 'http://' + this.host + ':' + this.port;

    //this.client = restify.createStringClient({url: this.url});
    this.client = restify.createJsonClient({url: this.url});
}

HttpClient.prototype.get = function (path_or_options, cb) {
    this.client.get(path_or_options, function (err, req, res, data) {
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
    client: function () {
        return new HttpClient({host: host, port: port});
    }
};

module.exports = http;

