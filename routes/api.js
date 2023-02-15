/*
*
*
*       Complete the API routing below
*
*

I can POST a thread to a specific message board by passing form data text and delete_password 
to /api/threads/{board}.(Recomend res.redirect to board page /b/{board}) Saved will be _id, 
text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), 
delete_password, & replies(array).

I can POST a reply to a thead on a specific board by passing form data text, delete_password, & 
thread_id to /api/replies/{board} and it will also update the bumped_on date to the comments date.
(Recomend res.redirect to thread page /b/{board}/{thread_id}) In the thread's 'replies' array will 
be saved _id, text, created_on, delete_password, & reported.
//
I can GET an array of the most recent 10 bumped threads on the board with only the most recent 3 
replies from /api/threads/{board}. The reported and delete_passwords fields will not be sent.

I can GET an entire thread with all it's replies from /api/replies/{board}?thread_id={thread_id}. 
Also hiding the same fields.

I can delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along 
the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')

I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to 
/api/replies/{board}and pass along the thread_id, reply_id, & delete_password. 
(Text response will be 'incorrect password' or 'success')
 https://docs.mongodb.com/manual/tutorial/query-array-of-documents/
 
 
I can report a thread and change it's reported value to true by sending a PUT request to 
/api/threads/{board} and pass along the thread_id. (Text response will be 'success')

I can report a reply and change it's reported value to true by sending a PUT request to 
/api/replies/{board} and pass along the thread_id & reply_id. (Text response will be 
'success')


*/

"use strict";
var SuperHandler = require("../controllers/SuperHandler.js");
var expect = require("chai").expect;

var superHandler = new SuperHandler();

module.exports = function(app) {
  app
    .route("/api/threads/:board")
    .post((req, res) => {
      var { board, text, delete_password } = req.body;
      var board = req.body.board;
      console.log("POSTING THREAD!");
      var saveThread = data => {
        if (data) {
          res.redirect(`/b/${board}`);
        } else {
          res.send('fatal error');
        }
      };

      superHandler.saveThread(
        { board: board, text: text, delete_password: delete_password },
        saveThread
      );

      /* I can POST a thread to a specific message board by passing form data text and delete_password 
to /api/threads/{board}.(Recomend res.redirect to board page /b/{board}) Saved will be _id, 
text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), 
delete_password, & replies(array).*/
    })
    .get((req, res) => {
      console.log("GETTING THREAD!");
      var { board } = req.params;
      var boardData = data => {
        if (data) {
          res.json(data);
        } else {
          res.send('fatal error');
        }
      };

      superHandler.boardData(board, boardData);

      /*I can GET an array of the most recent 10 bumped threads on the board with only the most recent 3 
replies from /api/threads/{board}. The reported and delete_passwords fields will not be sent.*/
    })
    .delete((req, res) => {
      var obj = {
        board: req.body.board,
        delete_password: req.body.delete_password,
        _id: req.body.thread_id
      };

      console.log("DELETING THREAD!");
      var deleteThread = data => {
        if (data) res.send("success");
        else res.send("incorrect password");
      };

      superHandler.deleteThread(obj, deleteThread);

      /*I can delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along 
the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')*/
    })
    .put((req, res) => {
      var obj = { board: req.body.board, _id: req.body.thread_id };
      console.log("REPORTING THREAD!");

      var reportThread = data => {
        if (data) res.send("success");
        else res.send("could not find");
      };

      superHandler.reportThread(obj, reportThread);

      /* 
I can report a thread and change it's reported value to true by sending a PUT request to 
/api/threads/{board} and pass along the thread_id. (Text response will be 'success')
*/
    });

  app
    .route("/api/replies/:board")
    .post((req, res) => {
      var { board, text, delete_password, thread_id } = req.body;

      console.log("POSTING REPLY!");

      var saveReply = data => {
        if (data) {
          res.redirect(`/b/${board}`);
        } else res.send("could not find");
      };

      superHandler.saveReply(
        {
          board: board,
          text: text,
          delete_password: delete_password,
          _id: thread_id
        },
        saveReply
      );

      console.log("WORKS!");

      /*
I can POST a reply to a thead on a specific board by passing form data text, delete_password, & 
thread_id to /api/replies/{board} and it will also update the bumped_on date to the comments date.
(Recomend res.redirect to thread page /b/{board}/{thread_id}) In the thread's 'replies' array will 
be saved _id, text, created_on, delete_password, & reported.
  */
    })
    .get((req, res) => {
      console.log("GETTING REPLY!");

      var obj = { board: req.params.board, _id: req.query.thread_id };

      var threadData = data => {
        if (data) {
          console.log(data)
          res.json(data);
        } else {
          res.send('fatal error');
        }
      };

      superHandler.threadData(obj, threadData);
    })
    .delete((req, res) => {
      var obj = {
        board: req.body.board,
        _id: req.body.thread_id,
        reply_id: req.body.reply_id,
        delete_password: req.body.delete_password
      };
      console.log("DELETING REPLY!");
      var deleteReply = data => {
        if (data)  res.send('success');
        else res.send("incorrect password");
      };

      superHandler.deleteReply(obj, deleteReply);

      /*I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to 
/api/replies/{board}and pass along the thread_id, reply_id, & delete_password. 
(Text response will be 'incorrect password' or 'success')
 https://docs.mongodb.com/manual/tutorial/query-array-of-documents/
 */
    })
    .put((req, res) => {
      var obj = {
        board: req.body.board,
        _id: req.body.thread_id,
        reply_id: req.body.reply_id
      };

      console.log("REPORTING REPLY!");
      var reportReply = data => {
        if (data) res.send("success");
        else res.send("could not find");
      };

      superHandler.reportReply(obj, reportReply);
    });
};
