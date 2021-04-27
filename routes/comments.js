const router = require('express').Router();
const mongoose = require('mongoose');
let Comment = require('../models/comment.model');
let Post = require('../models/post.model');
const { check, validationResult, query } = require('express-validator');

router.route('/').get((req, res) => {
  res.send("Hello World!");
});

router.route('/:postId/comments/create').post( [
  check('username').isLength({min:1, max:100}).withMessage("Invalid username length, should be between 1, 20."),
  check('text').isLength({min:1, max:1000}).withMessage("Invalid text length, must be between 1, 1000."),
  // check('datePosted').notEmpty().withMessage("Invalid date value, received none."),
  // need a standard for tag case sensitivity
  check('numLikes').isNumeric().withMessage("Invalid type for numComments, should be of Number type."),
], (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({
      message: "Errors: "
    })
  }
  const query = {
    _id: new mongoose.Types.ObjectId(),
    text: req.body.text,
    username: req.body.username,
    numLikes: req.body.numLikes,
    postId: req.params.postId,
    datePosted: new Date(),
    likedUsers: req.body.likedUsers
  }
  const newComment = new Comment(query);
  var resString = "";
  newComment.save()
    .then(() => {
      Post.updateOne({"_id": req.params.postId}, {$inc : {"numComments" : 1}})
      .then(() => {
        console.log("incrementing numComments in post with id: " + req.params.postId);
      })
      .catch((e)=>res.status(400).json({"err": "can't find post w/ id: " + req.params.postId}));
      res.status(200).json({"success" : "comment successfully added"});
    })
    .catch(err => res.status(400).send("Error: " + err))

  // increment numComments field in post
  Post.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$inc: {numComments: 1}});

})

router.route('/username/:username').get((req, res) => {
  Comment.find({username: req.params.username})
    .then(comment => res.json(comment))
    .catch(err => res.status(400).send("cannot find any comments under username: " + req.params.username))
})

router.route('/post/:postId').get((req, res) => {
  Comment.find({postId: req.params.postId})
    .then(comment => res.json(comment))
    .catch(err => res.status(400).send("cannot find any comments under post: " + req.params.postId))
})

router.route('/:commentId/user/:username/hasLiked').get((req, res) => {
  Comment.find( {likedUsers : req.params.username, _id : req.params.commentId})
    .then((comment) => {
      if (!Array.isArray(comment) || !comment.length) {
        res.json({"hasLiked" : false});
      }
      else {
        res.json({"hasLiked" : true});
      }
    })
    .catch((err) => res.status(400).json({"err when fetching comments" : err}));
})
module.exports = router;