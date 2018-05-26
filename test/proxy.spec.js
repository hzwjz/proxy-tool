/**
 * test proxy
 */
let expect = require('chai').expect;
let server = require('../src/server');
let koa = require('koa');
let route = require('koa-route');
let request = require('supertest');

describe('test proxy func', function() {
    let app, app2;

    before(function() {
        // use some default config
        app = (new server({
            'port' : 8001,
            'proxy' : {
                'rules' : [
                    '^\/api'
                ],
                'host' : 'http://localhost:8002',
                // 'queries' : {
                //     'format': 'json'
                // },
                // 'headers': {},
                // 'path': function (option) {
                    
                // }
            }
        })).start();
        console.log('start app1 listen port 8001');

        // create another server
        app2 = new koa();
        app2.use(route.get('/api/server.js', async function(context, next){
            context.body = 'ok';
                    
            await next();
        }));
        app2.listen(8002);
        console.log('start app2 listen port 8002');
    });

    describe('test static server', function() {
        it('should return js file', function(done) {
            request(app)
                .get('/src/server.js')
                .expect(200)
                .expect('Content-Type', /application\/javascript/)
                .end(function(err, res) {
                    if (err) throw err;
                    done();
                });
        });
    });

    describe('test simple get method request by proxy', function() {
        it('should get ok from app2 server by proxy request', function(done) {
            request(app)
                .get('/api/server.js')
                .expect(200)
                .expect('Content-Type', /text\/plain/)
                .expect(function(res) {
                    res.body == 'ok';
                })
                .end(function(err, res) {
                    if (err) throw err;
                    done();
                });
        });
    });

});