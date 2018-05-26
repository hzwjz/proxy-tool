/**
 * test proxy
 */
let expect = require('chai').expect;
let server = require('../src/server');
let request = require('supertest');

describe('test proxy func', function() {
    let app;

    before(function() {
        // use some default config
        app = (new server({
            // "proxy" : {
            //     "rules" : [
            //         "^\/api"
            //     ],
            //     "host" : "http://www.baidu.com",
            //     "queries" : {
            //         "format": "json"
            //     },
            //     "headers": {},
            //     "path": function (option) {
                    
            //     }
            // }
        })).start();
    });

    describe('test static server', function(done) {
        it('should return js file', function() {
            request(app)
                .get('/src/server.js')
                .expect('Content-Type', /application\/javascript/)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    done();
                });
        });
    });

    describe('test simple get method request by proxy', function(done) {
        it('should return index page of baidu by proxy request', function() {
            request(app)
                .get('/api/server.js')
                .expect('Content-Type', /text\/html/)
                .expect(200)
                .end(function(err, res) {
                    if (err) throw err;
                    done();
                });
        });
    });

});