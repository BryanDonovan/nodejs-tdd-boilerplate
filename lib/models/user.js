function User() {
}

User.create = function (args, cb) {
    cb(null, {id: 123});
};

module.exports = User;
