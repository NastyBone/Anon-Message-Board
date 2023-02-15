/*


I can POST a thread to a specific message board by passing form data text and delete_password 
to /api/threads/{board}.(Recomend res.redirect to board page /b/{board}) Saved will be _id, 
text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), 
delete_password, & replies(array).

I can POST a reply to a thead on a specific board by passing form data text, delete_password, & 
thread_id to /api/replies/{board} and it will also update the bumped_on date to the comments date.
(Recomend res.redirect to thread page /b/{board}/{thread_id}) In the thread's 'replies' array will 
be saved _id, text, created_on, delete_password, & reported.

I can GET an array of the most recent 10 bumped threads on the board with only the most recent 3 
replies from /api/threads/{board}. The reported and delete_passwords fields will not be sent.

I can GET an entire thread with all it's replies from /api/replies/{board}?thread_id={thread_id}. 
Also hiding the same fields.

I can delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along 
the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')

I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to 
/api/replies/{board}and pass along the thread_id, reply_id, & delete_password. 
(Text response will be 'incorrect password' or 'success')

I can report a thread and change it's reported value to true by sending a PUT request to 
/api/threads/{board} and pass along the thread_id. (Text response will be 'success')

I can report a reply and change it's reported value to true by sending a PUT request to 
/api/replies/{board} and pass along the thread_id & reply_id. (Text response will be 
'success') 


*/
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
var DBKEY = process.env.DBKEY;
MongoClient.connect(DBKEY, (err, db) => {
  if (err) console.log(err);
  //else if (db) db.collection("test").find({}) .toArray((err, data) => console.log(data));
 //  db.dropDatabase()
  // db.getCollectionNames()
});

function SuperHandler() {
  this.saveThread = (thread, callback) => {
    try {
      MongoClient.connect(DBKEY, (err, db) => {
        if (db) {
          db.collection(thread.board).insertOne(
            {
              board: thread.board,
              text: thread.text,
              created_on: new Date(),
              bumped_on: new Date(),
              reported: false,
              delete_password: thread.delete_password,
              replies: []
            },
            (err, data) => {
              console.log("WORKS");
              callback(data)
            }
          );
        }
      });

      /*
I can POST a thread to a specific message board by passing form data text and delete_password 
to /api/threads/{board}.(Recomend res.redirect to board page /b/{board}) Saved will be _id, 
text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), 
delete_password, & replies(array).*/
    } catch (e) {
      callback(false);
    }
  };

  this.saveReply = (thread, callback) => {
    
    try {
      MongoClient.connect(DBKEY, (err, db) => {
        if (db) {
          db.collection(thread.board).findOneAndUpdate(
            { _id: new ObjectId(thread._id) },
            {
              $set: { bumped_on: new Date() },
              $push: {
                replies: {
                  text: thread.text,
                  created_on: new Date(),
                  delete_password: thread.delete_password,
                  reported: false,
                  reply_id: new ObjectId()
                }
              }
            },
            { returnNewDocument: true, upsert: false },
            (err, data) => {
              if (err || !data.lastErrorObject.n) callback(false);
              else callback(true);
            }
          );
        }
      });
    } catch (e) {
      callback(false);
    }
    /*
   I can POST a reply to a thead on a specific board by passing form data text, delete_password, & 
thread_id to /api/replies/{board} and it will also update the bumped_on date to the comments date.
(Recomend res.redirect to thread page /b/{board}/{thread_id}) In the thread's 'replies' array will 
be saved _id, text, created_on, delete_password, & reported.
   */
  };

  this.boardData = (board, callback) => {
    try {
      var obj = [];
      MongoClient.connect(DBKEY, (err, db) => {
        if (db) {
          db.collection(board)
            .find({ board: board })
            .sort({ bumped_on: -1 })
            .limit(10)
            .toArray((err, data) => {
              for (let j = 0; j < data.length; j++) {
                delete data[j].delete_password;
                delete data[j].reported;

                if (data[j].replies) {
                  for (var i = 0; i < data[j].replies.length; i++) {
                    if (i >= 3) {
                      delete data[j].replies.pop();
                    } else {
                      delete data[j].replies[i].delete_password;
                      delete data[j].replies[i].reported;
                    
                    }
                  }
                }
              }

              callback(data);
              console.log("WORKS");
              /*Then, limit the replies[] to 3. Maybe mapping */
            });
        }
      });
    } catch (e) {
      callback(false);
    }
    /* I can GET an array of the most recent 10 bumped threads on the board with only the most recent 3 
replies from /api/threads/{board}. The reported and delete_passwords fields will not be sent.*/
  };

  this.threadData = (thread, callback) => {
    
    try{
      
    } catch(e){ callback(false)}
    
    
    try {
      MongoClient.connect(DBKEY, (err, db) => {
        if (db) {
          db.collection(thread.board)
            .findOne({ _id: new ObjectId(thread._id)} ,(err, data) => {
            if(err || data == null) {
              
              callback(false) 
              
            } else {
            delete data.reported
            delete data.delete_reply
            
            
              for (var i = 0; i < data.replies.length; i++) {
                delete data.replies[i].delete_password;
                delete data.replies[i].reported;
              }
              callback(data);
            }});
        }
      });
    } catch (e) {
      callback(false);
    }
    /*I can GET an entire thread with all it's replies from /api/replies/{board}?thread_id={thread_id}. 
Also hiding the same fields.*/
  };

  this.deleteThread = (thread, callback) => {
    try {
      MongoClient.connect(DBKEY, (err, db) => {
        if (db) {
          db.collection(thread.board).findOneAndDelete({_id: new ObjectId(thread._id), delete_password: thread.delete_password}, (err, data) => {
            if (err || data == null) callback(false);
            else callback(true);
          });
        }
      });
    } catch (e) {
      callback(false);
    }

    /*I can delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along 
the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')*/
  };

  this.deleteReply = (reply, callback) => {
    try {
 
      MongoClient.connect(DBKEY, (err, db) => {
        if (db) {
          db.collection(reply.board).findOneAndUpdate(
            {
              _id: new ObjectId(reply._id),
              "replies.reply_id": new ObjectId(reply.reply_id),
              "replies.delete_password": reply.delete_password
            },
            { $set: { "replies.$.text": "[deleted]" } },
            { new: true, upsert: false },
            (err, data) => {
      
              if (err || !data.lastErrorObject.n) callback(false);
              else callback(true);
            }
          );
        }
      });
    } catch (e) {
      callback(false);
    }
  
    /*I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to 
/api/replies/{board}and pass along the thread_id, reply_id, & delete_password. 
(Text response will be 'incorrect password' or 'success')
 https://docs.mongodb.com/manual/tutorial/query-array-of-documents/
 */
  };

  this.reportThread = (thread, callback) => {
    try {
      MongoClient.connect(DBKEY, (err, db) => {
        if (db) {
          db.collection(thread.board).findOneAndUpdate(
            { _id: new ObjectId(thread._id) },
            { $set: { reported: true } },
            { new: true, upsert: false },
            (err, data) => {
              if (err || !data.lastErrorObject.n) callback(false);

              else callback(true);
            }
          );
        }
      });
    } catch (e) {
      callback(false);
    }

    /* 
I can report a thread and change it's reported value to true by sending a PUT request to 
/api/threads/{board} and pass along the thread_id. (Text response will be 'success')
*/
  };

  this.reportReply = (reply, callback) => {
    try {
      MongoClient.connect(DBKEY, (err, db) => {
        if (db) {
          db.collection(reply.board).findOneAndUpdate(
            {
              _id: new ObjectId(reply._id),
              "replies.reply_id": new ObjectId(reply.reply_id)
            },
            { $set: { "replies.$.reported": true } },
            { new: false, upsert: false },
            (err, data) => {
              if (err || !data.lastErrorObject.n) callback(false);
              else callback(true);
            }
          );
        }
      });
    } catch (e) {
      callback(false);
    }
  };
}

module.exports = SuperHandler;
