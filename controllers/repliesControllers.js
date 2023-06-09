const { v4: uuidv4 } = require('uuid');
const { ObjectId } = require('mongodb');

async function getReply(req, res) {
  try {
    const { thread_id } = req.query;
    const { board } = req.params;

    const db = dbConnection.db('anonymous_message_board');
    const collection = db.collection('threads');

    const query = { _id: thread_id, board: board };
    const options = {
      projection: { reported: 0, delete_password: 0 },
    }
    const data = await collection.findOne(query.options);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).send("Server Failed");
  }
}
async function getReplies(req, res) {
  try {
    const { thread_id } = req.query;
    const { board } = req.params;

    const db = dbConnection.db('anonymous_message_board');
    const collection = db.collection('threads');

    const query = { _id: thread_id, board: board };
    const options = {
      projection: { reported: 0, delete_password: 0 },
    }
    const data = await collection.findOne(query.options);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).send("Server Failed");
  }
}

async function postReply(req, res) {
  try {
    const { board } = req.params;
    const { body } = req;
    const { thread_id, text, delete_password } = body;
    if (!thread_id || !text || !delete_password) return res.status(400).send('Invalid Request');


    const db = dbConnection.db('anonymous_message_board');
    const collection = db.collection('threads');

    const current = new Date();
    const query = { _id: new ObjectId(thread_id), board: board };
    const reply = {
      _id: uuidv4(),
      text: text,
      created_on: current,
      delete_password: delete_password,
      reported: false
    };
    const data = await collection.updateOne(query, {
      $set: { bumped_on: current },
      $push: { replies: reply }
    });
    return res.status(201).json("Created");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Failed");
  }
}

async function reportReply(req, res) {
  try {
    const { board } = req.params;
    const { body } = req;
    const { thread_id, reply_id } = body;

    const db = dbConnection.db('anonymous_message_board');
    const collection = db.collection('threads');
    const query = { _id: new ObjectId(thread_id), board: board };

    const data = await collection.findOne(query);
    const reported = data.replies.filter(reply => reply._id === reply_id);
    if (!reported.length) return res.status(404).json("Reply cannot found");
    const updatedReplies = data.replies.map(reply => {
      if (reply._id === reply_id) reply.reported = true;
      return reply;
    });
    await collection.updateOne(query, {
      $set: { replies: updatedReplies },
    })
    return res.status(200).json('"reported"');
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Failed");
  }
}

async function deleteReply(req, res) {
  try {
    const { board } = req.params;
    const { body } = req;
    const { thread_id, reply_id, delete_password } = body;

    const db = dbConnection.db('anonymous_message_board');
    const collection = db.collection('threads');
    const query = { _id: new ObjectId(thread_id), board: board };

    const data = await collection.findOne(query);
    const deleted = data.replies.filter(reply => reply._id === reply_id);
    if (!deleted.length) return res.status(404).json("Reply cannot found");
    if (deleted[0].delete_password !== delete_password) return res.status(400).json("incorrect password");
    const updatedReplies = data.replies.map(reply => {
      if (reply._id === reply_id) reply.text = "[deleted]";
      return reply;
    });
    await collection.updateOne(query, {
      $set: { replies: updatedReplies },
    })
    return res.status(200).json('"success"');
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Failed");
  }
}

module.exports = {
  getReply,
  getReplies,
  postReply,
  reportReply,
  deleteReply
}