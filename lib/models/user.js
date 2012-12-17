function User(args) {
    this.id = args.id || 123;
    this.username = args.username;
}

User.create = function (args, cb) {
    cb(null, new User(args));
};

module.exports = User;
