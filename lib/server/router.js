var router = {
    register_routes: function (server, routes) {
        if (!Array.isArray(routes)) { throw new Error('routes must be an array'); }

        routes.forEach(function (route) {
            if (!route.middleware) {
                route.middleware = [];
            }

            server[route.method](route.url, route.middleware, function (req, res, next) {
                route.func(req, res, next);
            });
        });
    }
};

module.exports = router;
