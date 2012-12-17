var controller = require('./controller');

var routes = [
    {
        method     : "post",
        url        : "/users",
        func       : controller.create,
        middleware : []
    }
];

module.exports = routes;
