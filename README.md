nodejs-tdd-boilerplate
======================

# NodeJS TDD Boilerplate

A basic boilerplate for NodeJS REST API applications that emphasizes code consistency and excellent test coverage.

## Features

* [mocha](https://github.com/visionmedia/mocha) test framework.
* [sinon](http://sinonjs.org) stubbing framework.
* [istanbul](https://github.com/yahoo/istanbul) test coverage framework.
* [jshint](http://jshint.com/) code linting.
* [restify](http://mcavage.github.com/node-restify/) REST framework.
* choice between make and [jake](https://github.com/mde/jake) build tool.
* choice of combined or separate servers for each 'app'.
* servers can run on multiple ports.

## Planned
* Actual model implementation example instead of stubbed model.
* Bamboo integration example.

## Setup

Assuming you already have NodeJS 0.8.11 or higher installed:

    git clone https://github.com/BryanDonovan/nodejs-tdd-boilerplate.git
    cd nodejs-tdd-boilerplate
    npm install .
    make

The `jake` or `make` command will run JSHint, all the mocha unit tests, and check the test coverage.  To view the test coverage report, open coverage/lcov-report/index.html after running `make`.

You can also run `make test` to just run the tests with coverage, `make test-cov` to run the tests and attempt to open the coverage report in your browser, and `make lint` to run JSHint.

To run the acceptance tests (which are just mocha tests), first start the server:

    bin/start all

Then:

    make test-acceptance
or:

    jake test:acceptance

You can launch the sever on more than one port via `bin/launch`, for example:

    bin/launch users

.. will launch the users app on two ports (specified in config.js).

Then you can run the acceptance tests against either of those ports by specifying the PORT env variable:

    PORT=12100 make test-acceptance
