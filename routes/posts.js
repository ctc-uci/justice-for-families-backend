const router = require('express').Router();
const mongoose = require('mongoose');
let Post = require('../models/post.model');
const db = require('./database');
// import "./database";

router.route('/').get((req, res) => {
  res.send("Hello world");
})

router.route('/add').post((req,res) => {
  query = {
    "_id" : new mongoose.Types.ObjectId(),
    "text" : req.body.text,
    "username" : req.body.username,
    "anonymous" : false,
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