/*
 
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");
var ObjectId = require('mongodb').ObjectId

chai.use(chaiHttp);

var testId1;
var testId2;
var testText = "test";

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("POST", function() {
      test("POST A THREAD", done => {
        chai
          .request(server)
          .post("/api/threads/test")
          .send({ board: "test", text: testText, delete_password: "delete" })
          .end((req, res) => {
            assert.equal(res.status, 200);
          done()
          });
      });

      test("POST A THREAD TO DELETE", done => {
        chai
          .request(server)
          .post("/api/threads/test")
          .send({
            board: "test",
            text: "delete testing",
            delete_password: "first"
          })
          .end((req, res) => {
            assert.equal(res.status, 200);
          done()
          });
      });
    });

    suite("GET", function() {
      test("GET THE BOARD", done => {
        chai
          .request(server)
          .get("/api/threads/test")
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.isBelow(res.body.length, 11);
            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "bumped_on");
            assert.property(res.body[0], "replies");
            assert.isArray(res.body[0].replies);
            assert.isBelow(res.body[0].replies.length, 4);
            testId1 = res.body[0]._id;
            testId2 = res.body[1]._id;
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("CORRECT DELETING", done => {
        chai
          .request(server)
          .delete("/api/threads/test")
          .send({ board: "test", _id: testId2, delete_password: "delete" })
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });

      test("INCORRECT DELETING", done => {
        chai
          .request(server)
          .delete("/api/threads/test")
          .send({ board: "test", _id: "lmao", delete_password: "delete" })
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });
    });
    
    suite("PUT", function() {
      test("SOME HURTED ASS WANT TO REPORT", done => {
        chai
          .request(server)
          .put("/api/threads/test")
          .send({ board: "test", thread_id: testId1 })
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });

      test("BUT OH NO, DOESNT HAVE THE ID, LOL", done => {
        chai
          .request(server)
          .put("/api/threads/test")
          .send({ board: "test", id: "" })
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "could not find");
            done();
          });
      });
    });
  });

  var replyId;
  var deleteReplyId;

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {
      test("POSTING A REPLY", done => {
        chai
          .request(server)
          .post("/api/replies/test")
          .send({ board: "test", thread_id: testId1, delete_password: "reply" })
          .end((req, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });

      test("FOR DELETING", done => {
        chai
          .request(server)
          .post("/api/replies/test")
          .send({
            board: "test",
            thread_id: testId2,
            delete_password: "delete"
          })
          .end((req, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });

      test("BUT U DONT KNOW HOW", done => {
        chai
          .request(server)
          .post("/api/replies/test")
          .send({ board: "test", text: 'replying!',thread_id: '123456789101', delete_password: "reply" })
          .end((req, res) => {

            assert.equal(res.status, 200);
            assert.equal(res.text, "could not find");
            done()
          });
      });
    });

    suite("GET", function() {
      test("GET THE DATA", done => {
        chai
          .request(server)
          .get("/api/replies/test")
          .query({ thread_id: testId1 })
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.property(res.body, "_id");
            assert.property(res.body, "text");
            assert.property(res.body, "created_on");
            assert.property(res.body, "bumped_on");
            assert.property(res.body, "replies");
            assert.isArray(res.body.replies);
            replyId = res.body.replies[0].reply_id;
          

            done();
          });
      });
      test("BUT OH, AGAIN", done => {
        chai
          .request(server)
          .get("/api/replies/test")
          .query({ thread_id: "123456789101" })
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "fatal error");
            done();
          });
      });
    });

    suite("PUT", function() {
      test("SOME VULCANIZED ASS...", done => {
        chai
          .request(server)
          .put("/api/replies/test")
          .send({ board: "test", thread_id: testId1, reply_id: replyId })
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });

      test("TRY SO HARD", done => {
        chai
          .request(server)
          .put("/api/replies/test")
          .send({ board: "test", thread_id: testId1, reply_id: "123456789101" })
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "could not find");
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("WE ALL MAKE MISTAKES", done => {
        chai
          .request(server)
          .delete("/api/replies/test")
          .send({
            board: "test",
            thread_id: testId1,
            reply_id: replyId,
            delete_password: "reply"
          })
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });

      test("BUT TWICE?", done => {
        chai
          .request(server)
          .delete("/api/replies/test")
          .send({
            board: "test",
            thread_id: testId1,
            reply_id: replyId,
            delete_password: "rolf"
          })
          .end((req, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.text, "incorrect password");
            done();
          });
      });
    });
  });
});
