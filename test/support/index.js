require('../../lib');

var support = {
    http: require('./http'),
    random: require('./random'),
    walk_dir: require('./walk_dir'),

    shallow_clone: function (object) {
        var ret = {};
        if (object) {
            Object.keys(object).forEach(function (val) {
                ret[val] = object[val];
            });
        }
        return ret;
    },

    fake_error: function (message) {
        return new Error(message || support.random.string());
    }
};

module.exports = support;
