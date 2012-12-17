function User(args) {
    this.id = args.id;
}

User.create = function (args, cb) {
    cb(null, new User(args));
};

module.exports = User;
