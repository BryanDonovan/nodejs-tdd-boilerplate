process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

if (!global.main) {
    global.main = {};
}

main.app = require('./app');
main.models = require('./models');
main.server = require('./server');
