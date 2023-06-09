const { ObjectId } = require('mongodb');

async function getThread(req, res){
    try{
      const { thread_id } = req.query;
      const { board } = req.params;

      const db = dbConnection.db('anonymous_message_board');
      const collection = db.collection('threads');
      
      const query = { _id:thread_id, board:board };
      const options = {
        projection: { reported: 0, delete_password: 0 },
      }
      const data = await collection.findOne(query. options);
      return res.status(200).json(data);
  }catch(err){
    return res.status(500).send("Server Failed");
  }
}
async function getThreads(req, res){
  try{
    const { board } = req.params;
    const db = dbConnection.db('anonymous_message_board');
    const collection = db.collection('threads');
    const query = { board:board };
    const options = {
      sort: { created_on: -1 },
      projection: { reported: 0, delete_password: 0 },
    }
    const rawData = await collection.find(query, options).limit(10).toArray()
    const data = rawData.map((entry) => {
      slicedReplies = entry.replies.slice(-3);
      entry.replies = slicedReplies;
      return entry;
    });
    return res.status(200).json(data);
  }catch(err){
    return res.status(500).send("Server Failed");
  }
}

async function postThread(req, res){
  try{
    const { board } = req.params;
    const { body } = req;
    const { text, delete_password } = body;
    if(!text || !delete_password) return res.status(400).send('Invalid Request');
    
    const db = dbConnection.db('anonymous_message_board');
    const collection = db.collection('threads');
    
    const current = new Date();
    
    await collection.insertOne({
      board: board,
      text: text,
      created_on: current,
      bumped_on: current,
      reported: false,
      delete_password: delete_password,
      replies: []
    });
    
    return res.status(201).json("Created");
  }catch(err){
    return res.status(500).send("Server Failed");
  }
}

async function reportThread(req, res){
  try{
    const { board } = req.params;
    const { body } = req;
    const { report_id } = body;

    const db = dbConnection.db('anonymous_message_board');
    const collection = db.collection('threads');
    const query = { _id: new ObjectId(report_id), board: board };
    const data = await collection.updateOne(query, {
      $set: {reported: true},
    })

    res.status(200).json('"reported"');
  }catch(err){
    console.log(err);
    res.status(500).send("Server Failed");
  }
}

async function deleteThread(req, res){
  try{
    const { board } = req.params;
    const { body } = req;
    const { thread_id, delete_password } = body;
    if(!thread_id || !delete_password) return res.status(400).send('Invalid Request');

    const db = dbConnection.db('anonymous_message_board');
    const collection = db.collection('threads');
    const query = { _id: new ObjectId(thread_id), board: board };
    const data = await collection.findOne(query);
    const rowPassword = data.delete_password;
    if(delete_password !== rowPassword) return res.status(400).json("incorrect password");
    await collection.deleteOne(query);
    return res.status(200).json('"success"');
  }catch(err){
    console.log(err);
    res.status(500).send("Server Failed");
  }
}

module.exports = {
  getThread,
  getThreads,
  postThread,
  reportThread,
  deleteThread
}