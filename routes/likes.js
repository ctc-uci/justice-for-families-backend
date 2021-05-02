const router = require('express').Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const Like = require('../models/like.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');

router.post('/like', async function(req, res) {
    query = {
        "_id": new mongoose.Types.ObjectId(),
        "username": req.body.username,
        "date": new Date(),
        "postId": new mongoose.Types.ObjectId(req.body.postId)
    }
    const newLike = new Like(query);
    await newLike.save().then(() => res.status(200).send("liked")).catch(err => res.status(400).json("Error: " +  err))

    // increment likes field in post
    await Post.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$inc: {numLikes: 1}});

    // append to likedUsers array in post
    await Post.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$push: {likedUsers: req.body.username}});

    // append to likedPosts in user
    await User.updateOne({username: req.body.username}, {$push: {likedPosts: req.body.postId}});
});

router.post('/unlike', async function(req, res) {
    // delete like
    await Like.deleteOne({_id: new mongoose.Types.ObjectId(req.body.id)}).then(function() {
        res.status(200).send("like deleted");
    }).catch(function(error) {
        res.status(400).send(error);
    });

    // decrement likes field in post
    await Post.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$inc: { numLikes: -1}});

    // remove from likedUsers array in post
    await Post.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$pull: {likedUsers: req.body.username}});

    // remove from likedPosts in user
    await User.updateOne({username: req.body.username}, {$pull: {likedPosts: req.body.postId}});
});

router.post(
  "/byUser",
  [
    check("username")
      .isLength({ min: 1, max: 100 })
      .withMessage("Invalid username length, should be between 1, 100."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array(),
      });
    }

    const { username } = req.body;

    try {
      let likedPostIds = await Like.find()
        .where("username", username)
        .select("postId -_id")
        .exec();
      likedPostIds = likedPostIds.map((likedPostId) => likedPostId.postId);
    //   console.log(likedPostIds);

      const likedPosts = await Post.find().where("_id", likedPostIds).exec();
    //   console.log(likedPosts);

      res.status(200).json(likedPosts);
    } catch (err) {
      console.log(err);
      res.send(500);
    }
  }
);

module.exports = router;
