'use strict';

process.env.DB   = 'enlighTN-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../server/index'),
    cookie  = null,
    request = require('supertest');

describe('users', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=1234')
      .set('cookie', cookie)
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });
  describe('post /login', function(){
    it('should allow a user to login', function(done){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=1234')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
    it('should not allow a user to login with wrong credentials', function(done){
      request(app)
      .post('/login')
      .send('email=bob@aol.com')
      .send('password=abcd')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
  describe('post /register', function(){
    it('should allow a user to register', function(done){
      request(app)
      .post('/register')
      .send('email=jerry@aol.com')
      .send('password=1234')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
    it('should not allow a user to register if already registered', function(done){
      request(app)
      .post('/register')
      .send('email=bob@aol.com')
      .send('password=1234')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(400);
        done();
      });
    });
    it('should not allow a user to register if password is too short', function(done){
      request(app)
      .post('/register')
      .send('email=sarah@aol.com')
      .send('password=12')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(400);
        done();
      });
    });
  });
  describe('get /home', function(){
    it('should take a user to the home page', function(done){
      request(app)
      .get('/home')
      .set('cookie', cookie)
      .end(function(req,res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Music');
        done();
      });
    });
  });
  describe('get /locations', function(){
    it('should take a user to the locations page', function(done){
      request(app)
      .get('/locations')
      .set('cookie', cookie)
      .end(function(req,res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('STATION');
        done();
      });
    });
  });
  describe('get /locations/a00000000000000000000001', function(){
    it('should take a user to a specific location page', function(done){
      request(app)
      .get('/locations/a00000000000000000000001')
      .set('cookie', cookie)
      .end(function(req,res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('STATION');
        done();
      });
    });
  });
  describe('get /events', function(){
    it('should take a user to the events page', function(done){
      request(app)
      .get('/events')
      .set('cookie', cookie)
      .end(function(req,res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Performance');
        done();
      });
    });
  });
  describe('get /events/eee000000000000000000001', function(){
    it('should take a user to a specific location page', function(done){
      request(app)
      .get('/events/eee000000000000000000001')
      .set('cookie', cookie)
      .end(function(req,res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Midsummer');
        done();
      });
    });
    it('should not take a user to a specific location page if user is not logged in', function(done){
      request(app)
      .get('/events/eee000000000000000000001')
      .set('cookie')
      .end(function(req,res){
        expect(res.status).to.equal(401);
        done();
      });
    });
  });
  describe('delete /logout', function(){
    it('should log a user out', function(done){
      request(app)
      .delete('/logout')
      .end(function(err, res){
        expect(res.status).to.equal(401);
        done();
      });
    });
  }); 
});
