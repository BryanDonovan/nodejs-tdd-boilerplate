var ISTANBUL = './node_modules/.bin/istanbul';
var COVERAGE_OPTS = '--lines 95 --statements 90 --branches 80 --functions 90';

var print_opts = {printStdout: true, printStderr: true};

desc("Run jake test and jake lint");
task('default', ['lint', 'test'], {async: true}, complete);

desc('Run tests and check test coverage');
task('test', ['test:cover', 'test:check-coverage'], {async: true}, complete);

namespace('test', function() {
    desc('Run tests without coverage');
    task('no-cov', {async: true}, function(args) {
        var command = "test/run.js";
        jake.exec(command, complete, print_opts);
    });

    desc('Run tests with test coverage');
    task('cover', {async: true}, function() {
        var command = ISTANBUL + " cover test/run.js";
        jake.exec(command, complete, print_opts);
    });

    desc('Check test coverage');
    task('check-coverage', {async: true}, function() {
        var command = ISTANBUL + " check-coverage " + COVERAGE_OPTS;
        jake.exec(command, complete, print_opts);
    });

    desc('Run acceptance tests');
    task('acceptance', {async: true}, function() {
        var command = "test/run.js -T acceptance --timeout 30000";
        jake.exec(command, complete, print_opts);
    });
});

var JSHINT = './node_modules/.bin/jshint --config .jshintrc';

desc('Run jshint against src and test directories');
task('lint', {async: true}, function() {
    var commands = [
        "echo linting..",
        JSHINT + ' ./lib',
        JSHINT + ' ./test'
    ];
    jake.exec(commands, complete, print_opts);
});
