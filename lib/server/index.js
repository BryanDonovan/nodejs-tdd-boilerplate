var server = {
    AppRegistrar: require('./app_registrar'),
    AppServer: require('./app_server'),
    responder: require('./responder'),
    router: require('./router'),
    UncaughtExceptionHandler: require('./uncaught_exception_handler')
};

module.exports = server;
