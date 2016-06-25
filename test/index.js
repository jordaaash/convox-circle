'use strict';

var chai   = require('chai');
var expect = chai.expect;

chai.config.includeStack = true;

describe('HTTP server', function () {
    var http = require('http');
    var port = process.env.PORT;
    var status, body;

    before(function () {
        status = null;
        body   = '';
    });

    it('responds to GET on port ' + port, function (done) {
        http.get({ port: port }, function (response) {
            status = response.statusCode;

            response.on('data', function (data) {
                body += data;
            });

            response.on('end', done);
        }).on('error', done);
    });

    it('responds with OK status', function () {
        expect(status).to.equal(200);
    });

    it('responds with OK body', function () {
        expect(body).to.equal("Mr. Hammond, I think we're back in business!");
    });
});

describe('Postgres database', function () {
    var pg = require('pg');
    var client;

    before(function () {
        client = new pg.Client(process.env.POSTGRES_URL);
    });

    it('connects', function (done) {
        client.connect(function (error) {
            done(error);
        });
    });

    it('selects a value', function (done) {
        client.query('SELECT 1 as value', function (error, result) {
            if (error) {
                done(error);
            }
            else {
                expect(result).to.have.deep.property('rows[0].value', 1);
                done();
            }
        });
    });

    it('disconnects', function (done) {
        client.on('end', done);
        client.end();
    });
});

describe('Redis database', function () {
    var redis = require('redis');
    var client;

    before(function () {
        client = redis.createClient(process.env.REDIS_URL);
    });

    it('sets a value', function (done) {
        client.set('key', 'value', done);
    });

    it('gets a value', function (done) {
        client.get('key', function (error, value) {
            if (error) {
                done(error);
            }
            else {
                expect(value).to.equal('value');
                done();
            }
        });
    });

    it('deletes a key', function (done) {
        client.del('key', done);
    });

    it('disconnects', function () {
        client.quit();
    });
});
