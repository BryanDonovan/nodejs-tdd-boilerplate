module.exports = {
    common: {
        server: {
            port: 8080
        },

        apps: {
            users: {
                port: 12100,
                proxies: 2
            }
        }
    },

    dev: {},

    test: {}
};
