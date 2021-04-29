const router = require('express').Router();
const mongoose = require('mongoose');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');

const { check, validationResult } = require('express-validator');
const { json } = require('express');

// import "./database";

router.route('/').get((req, res) => {
  Post.find()
  .then(post => res.json(post))
  .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/create').post( [
  check('username').isLength({min:1, max:100}).withMessage("Invalid username length, should be between 1, 100."),
  check('text').isLength({min:1, max:1000}).withMessage("Invalid text length, must be between 1, 1000."),
  check('anonymous').isBoolean().withMessage("Invalid anonymity value, should be boolean."),
  // need a standard for date posted
  // check('datePosted').notEmpty().withMessage("Invalid date value, received none."),
  // need a standard for tag case sensitivity
  check('tags').notEmpty().withMessage("Invalid tags value, should not be empty."),
  check('numComments').isNumeric().withMessage("Invalid type for numComments, should be of Number type."),
  check('numLikes').isNumeric().withMessage("Invalid number of likes, should be numeric"),
  check('title').notEmpty().withMessage("Invalid title, should not be empty.")
], (req,res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return (res.status(400).json( {
      message:  errors.array()
    }))
  }

  query = {
    "_id" : new mongoose.Types.ObjectId(),
    "text" : req.body.text,
    "username" : req.body.username,
    "anonymous" : req.body.anonymous,
    "datePosted" : new Date(),
    "tags" : req.body.tags,
    "numComments" : req.body.numComments,
    "title" : req.body.title,
    "media" : req.body.media,
    "numLikes" : req.body.numLikes
  }
  
  const newPost = new Post(query);

  newPost.save()
    .then(() => res.send("post added"))
    .catch(err => res.status(400).json("Error: " +  err))

})

router.route("/edit").post(
  [
    check("postID")
      .exists()
      .custom((value, { req }) => mongoose.isValidObjectId(value))
      .withMessage("Invalid postID, should be a valid MongoDB ObjectID"),
    check("username")
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage("Invalid username length, should be between 1, 100."),
    check("text")
      .optional()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Invalid text length, must be between 1, 1000."),
    check("anonymous")
      .optional()
      .isBoolean()
      .withMessage("Invalid anonymity value, should be boolean."),
    check("datePosted")
      .optional()
      .isISO8601()
      .withMessage("Invalid date value, should be ISO8601."),
    check("tags")
      .optional()
      .notEmpty()
      .withMessage("Invalid tags value, should not be empty."),
    check("numComments")
      .optional()
      .isNumeric()
      .withMessage("Invalid type for numComments, should be of Number type."),
    check("numLikes")
      .optional()
      .isNumeric()
      .withMessage("Invalid number of likes, should be numeric"),
    check("title")
      .optional()
      .notEmpty()
      .withMessage("Invalid title, should not be empty."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array(),
      });
    }

    const {
      postID,
      username,
      text,
      anonymous,
      datePosted,
      tags,
      numComments,
      numLikes,
      title,
    } = req.body;

    try {
      const updateFields = {};
      if (username) updateFields["username"] = username;
      if (text) updateFields["text"] = text;
      if (anonymous) updateFields["anonymous"] = anonymous;
      if (datePosted) updateFields["datePosted"] = datePosted;
      if (tags) updateFields["tags"] = tags;
      if (numComments) updateFields["numComments"] = numComments;
      if (numLikes) updateFields["numLikes"] = numLikes;
      if (title) updateFields["title"] = title;

      const updatedPost = await Post.findOneAndUpdate(
        { _id: postID },
        { $set: updateFields },
        { new: true }
      );
      // console.log(updatedPost)

      if (!updatedPost){
        return res.status(400).send("Post not found")
      }

      res.send(updatedPost);
    } catch (err) {
      console.log(err);
      res.send(500);
    }
  }
);

router.route("/delete").post(
  [
    check("postID")
      .exists()
      .custom((value, { req }) => mongoose.isValidObjectId(value))
      .withMessage("Invalid postID, should be a valid MongoDB ObjectID"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array(),
      });
    }

    const { postID } = req.body;

    try {
      const deletedPosts = await Post.deleteMany({ _id: postID });
      const deletedComments = await Comment.deleteMany({ postId: postID });
      const deletedLikes = await Like.deleteMany({ postId: postID });
      // console.log(deletedPosts.deletedCount, deletedComments.deletedCount, deletedLikes.deletedCount);

      const responseBody = {
        deletedPosts: deletedPosts.deletedCount,
        deletedComments: deletedComments.deletedCount,
        deletedLikes:  deletedLikes.deletedCount
      }

      res.status(200).send(responseBody);
    } catch (err) {
      console.log(err);
      res.send(500);
    }
  }
);

// need to update to find tag within tags array (might take a long time to load though)
router.route('/tags/:tag').get((req, res) => {
  Post.find({tags: req.params.tag})
    .then(post => res.json(post))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/username/:username').get((req, res) => {
  Post.find({username: req.params.username})
    .then(post => res.json(post))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/datePosted/:datePosted').get((req, res) => {
  Post.find({datePosted: req.params.datePosted})
    .then(post => res.json(post))
    .catch(err => res.status(400).json('Error: ' + err))
})

router.route('/:postId/user/:username/hasLiked').get((req, res) => {
  Post.find({likedUsers : req.params.username, _id : req.params.postId})
    .then((post) => {
      if (!Array.isArray(post) || !post.length) {
        res.json({"hasLiked" : false});
      }
      else {
        res.json({"hasLiked" : true});
      }
    })
    .catch((err) => res.status(400).json({"err when fetching comments" : err}));
})
module.exports = router;