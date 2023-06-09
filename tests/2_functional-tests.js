const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('POST /api/threads/general', function(done) {
    chai.request(server)
      .post(`/api/threads/general`)
      .type('form')
      .send({ text: 'tobi' })
      .send({ delete_password: '16' })
      .end((err, res) => {
        assert.equal(res.status, 201)
        assert.equal(res.body, "Created")
        done();
      })
  });
  test('GET /api/threads/general', function(done) {
    chai.request(server)
      .get(`/api/threads/general`)
      .end((err, res) => {
        assert.equal(res.status, 200)
        done();
      })
  });
  test('DELETE /api/threads/general', function(done) {
    chai.request(server)
      .delete(`/api/threads/general`)
      .type('form')
      .send({ thread_id: '64833557dacf1868451fa6e0' })
      .send({ delete_password: 10 })
      .end((err, res) => {
        assert.equal(res.status, 400)
        assert.equal(res.body, "incorrect password")
        done();
      })
  });
  test('DELETE /api/threads/general', function(done) {
    chai.request(server)
      .delete(`/api/threads/general`)
      .type('form')
      .send({ thread_id: '64833557dacf1868451fa6e0' })
      .send({ delete_password: "16" })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body, "success")
        done();
      })
  });
  test('PUT /api/threads/general', function(done) {
    chai.request(server)
      .put(`/api/threads/general`)
      .type('form')
      .send({ thread_id: '6483102be31d3fffe263b62b' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body, "reported")
        done();
      })
  });
  test('POST /api/replies/general', function(done) {
    chai.request(server)
      .post(`/api/replies/general`)
      .type('form')
      .send({ thread_id: '6483102be31d3fffe263b62b' })
      .send({ text: 'naobi' })
      .send({ delete_password: '12' })
      .end((err, res) => {
        assert.equal(res.status, 201)
        assert.equal(res.body, "Created")
        done();
      })
  });
  test(`GET /api/replies/general?thread_id=6483102be31d3fffe263b62b`, function(done) {
    chai.request(server)
      .get(`/api/replies/general`)
      .end((err, res) => {
        assert.equal(res.status, 200)
        done();
      })
  });
  test('DELETE /api/replies/general', function(done) {
    chai.request(server)
      .delete(`/api/replies/general`)
      .type('form')
      .send({ thread_id: '6483102be31d3fffe263b62b' })
      .send({ reply_id: 'c260ba93-1e53-4e3f-a977-34ecd5bcd10d' })
      .send({ delete_password: '11' })
      .end((err, res) => {
        assert.equal(res.status, 400)
        assert.equal(res.body, "incorrect password")
        done();
      })
  });
  test('DELETE /api/replies/general', function(done) {
    chai.request(server)
      .delete(`/api/replies/general`)
      .type('form')
      .send({ thread_id: '6483102be31d3fffe263b62b' })
      .send({ reply_id: '0c60de24-becf-466a-ad48-150f037a8239' })
      .send({ delete_password: '12' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body, "success")
        done();
      })
  });
  test('PUT /api/replies/general', function(done) {
    chai.request(server)
      .put(`/api/threads/general`)
      .type('form')
      .send({ thread_id: '6483102be31d3fffe263b62b' })
      .send({ reply_id: '0c60de24-becf-466a-ad48-150f037a8239' })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body, "reported")
        done();
      })
  });
  after(function() {
    chai.request(server)
      .get('/api')
  });

});
