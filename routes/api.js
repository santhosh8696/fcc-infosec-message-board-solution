'use strict';

const {
  getThread,
  getThreads,
  postThread,
  reportThread,
  deleteThread 
} = require('../controllers/threadsControllers');

const {
  getReply,
  getReplies,
  postReply,
  reportReply,
  deleteReply 
} = require('../controllers/repliesControllers');

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .get(async function (req, res){
        if(req.query.thread_id) return await getThread(req, res); 
        await getThreads(req, res);      
    })
    .post(async function (req, res){
        await postThread(req, res);
    })
    .put(async function(req, res){
      await reportThread(req, res);
    })
    .delete(async function(req, res){
      await deleteThread(req, res);
    })
    
  app.route('/api/replies/:board')
    .get(async function(req, res){
      await getReplies(req, res);
    })
    .post(async function (req, res){
        await postReply(req, res)
    })
    .delete(async function(req, res){
      await deleteReply(req, res);
    })
    .put(async function(req, res){
      await reportReply(req, res);
    })

};
