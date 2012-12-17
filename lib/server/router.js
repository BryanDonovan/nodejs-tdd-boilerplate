var router = {
    register_routes: function (server, routes) {
        if (!Array.isArray(routes)) { throw new Error('routes must be an array'); }

        routes.forEach(function (route) {
            try {
                //log.debug("Registering route: ", route);

                if (!route.middleware) {
                    route.middleware = [];
                }

                server[route.method](route.url, route.middleware, function (req, res, next) {
                    if (req.middleware_error !== true) {
                        route.func(req, res, next);
                    } else if (next) {
                        return next();
                    }
                });
            } catch (e) {
                console.log("Failed to load route: ", route, e);
                //log.error("Failed to load route: ", route, e);
            }
        });
    }
};

module.exports = router;
