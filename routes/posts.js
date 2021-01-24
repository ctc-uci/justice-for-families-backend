const router = require('express').Router();
const mongoose = require('mongoose');
let Post = require('../models/post.model');
const { check, validationResult } = require('express-validator');

// import "./database";

router.route('/').get((req, res) => {
  res.send("Hello world");
})

router.route('/posts/create').post( [
  check('username').isLength({min:1, max:20}).withMessage("Invalid username length, should be between 1, 20."),
  check('text').isLength({min:1, max:1000}).withMessage("Invalid text length, must be between 1, 1000."),
  check('anonymous').isBoolean().withMessage("Invalid anonymity value, should be boolean."),
  // need a standard for date posted
  check('datePosted').notEmpty().withMessage("Invalid date value, received none."),
  // need a standard for tag case sensitivity
  check('tags').notEmpty().withMessage("Invalid tags value, should not be empty."),
  check('numComments').isNumeric().withMessage("Invalid type for numComments, should be of Number type."),
  check('numLikes').isNumeric().withMessage("Invalid number of likes, should be numeric"),
  check('title').notEmpty().withMessage("Invalid title, should not be empty.")
], (req,res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return (res.status(400).send( {
      message: "Errors: " + errors
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
    "media" : req.body.media
  }

  const newPost = new Post(query);

  newPost.save()
    .then(() => res.send("post added"))
    .catch(err => res.status(400).json("Error: " +  err))

})

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

module.exports = router;