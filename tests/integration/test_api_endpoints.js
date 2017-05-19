'use strict';

let chai = require('chai');
let expect = chai.expect;
let supertest = require('supertest');
let request = supertest('http://localhost:3000');
let zoneId = process.env.cfZone;

// Check Status Page
describe('Heimdall API Integration Tests', function() {
  describe('#GET /', function() {
    it('should get status page', function(done) {
      request.get('/')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('#GET /zones/:zoneId/dns_records', function() {
    it('should return empty before initialization', function(done) {
      request.get('/zones/' + zoneId + '/dns_records')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.be.empty;
          done();
        });
    });
  });

// Initialize Zone
  describe('#PATCH /zones/:zoneId/init', function() {
    it('should return 200', function(done) {
      request.patch('/zones/' + zoneId + '/init')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body.result).to.equal('success');
          done();
        });
    });
  });

// Create CNAME and A records
  describe('#POST /zones/:zoneId/dns_records', function() {
    it('should create a new A record', function(done) {
      request.post('/zones/' + zoneId + '/dns_records')
          .send({
            'type': 'A',
            'content': '127.0.0.1',
            'name': 'arecord',
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body.type).to.equal('A');
          expect(res.body.content).to.equal('127.0.0.1');
          expect(res.body.name).to.equal('arecord');
          done();
        });
    });
    it('should create a new CNAME record', function(done) {
      request.post('/zones/' + zoneId + '/dns_records')
          .send({
            'type': 'CNAME',
            'content': 'heimdall.xyx',
            'name': 'cnamerecord',
        })
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body.type).to.equal('CNAME');
          expect(res.body.content).to.equal('heimdall.xyx');
          expect(res.body.name).to.equal('cnamerecord.heimdall.xyx');
          done();
        });
    });
  });

// Verify zone isn't empty
  describe('#GET /zones/:zoneId/dns_records', function() {
    it('should not return empty', function(done) {
      request.get('/zones/' + zoneId + '/dns_records')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.be.not.empty;
          done();
        });
    });
  });

// Update records
  describe('#POST /zones/:zoneId/dns_records/{recordId}', function() {
    it('update \'A\' record created for testing', function(done) {
      request.get('/zones/' + zoneId + '/dns_records')
        .end(function(err, res) {
            res.body.forEach(function(record) {
                if (record.name == 'arecord') {
                    request.post('/zones/' + zoneId + '/dns_records/' + record.id)
                    .send({
                        'type': 'A',
                        'content': '127.0.0.1',
                        'name': 'arecord2',
                    })
                    .end(function(err, res) {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.message).to.equal('Record updated in both MongoDB and Cloudflare');
                        expect(res.body.result).to.equal('success');
                        expect(res.body.info.name).to.equal('arecord2' || 'arecord2');
                    done();
                    });
                }
            });
        });
    });
    it('update \'CNAME\' created for testing', function(done) {
      request.get('/zones/' + zoneId + '/dns_records')
        .end(function(err, res) {
            res.body.forEach(function(record) {
                if (record.name == 'cnamerecord') {
                    request.post('/zones/' + zoneId + '/dns_records/' + record.id)
                    .send({
                        'type': 'CNAME',
                        'content': 'heimdall.xyx',
                        'name': 'cnamerecord2',
                    })
                    .end(function(err, res) {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.message).to.equal('Record updated in both MongoDB and Cloudflare');
                        expect(res.body.result).to.equal('success');
                        expect(res.body.info.name).to.equal('cnamerecord2' || 'cnamerecord');
                    done();
                    });
                }
            });
        });
    });
  });

//Delete records created for testing
  describe('#DELETE /zones/:zoneId/dns_records', function() {
    it('delete \'A\' record created for testing', function(done) {
      request.get('/zones/' + zoneId + '/dns_records')
        .end(function(err, res) {
            res.body.forEach(function(record) {
                if (record.name == 'arecord' || record.name == 'arecord2' ) {
                    request.delete('/zones/' + zoneId + '/dns_records/' + record.id)
                    .end(function(err, res) {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.result).to.equal('Record deleted');
                    done();
                    });
                }
            });
        });
    });
    it('delete \'CNAME\' created for testing', function(done) {
      request.get('/zones/' + zoneId + '/dns_records')
        .end(function(err, res) {
            res.body.forEach(function(record) {
                if (record.name == 'cnamerecord' || record.name == 'cnamerecord2' ) {
                    request.delete('/zones/' + zoneId + '/dns_records/' + record.id)
                    .end(function(err, res) {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.result).to.equal('Record deleted');
                    done();
                    });
                }
            });
        });
    });
  });


});
