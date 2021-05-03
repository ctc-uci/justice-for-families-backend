const router = require('express').Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const Like = require('../models/like.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

router.post('/like', async function(req, res) {
    query = {
        "_id": new mongoose.Types.ObjectId(),
        "username": req.body.username,
        // "date": new Date(),
        "postId": new mongoose.Types.ObjectId(req.body.postId)
    }
    const newLike = new Like(query);
    await newLike.save().then(() => res.status(200).send("liked")).catch(err => res.status(400).json("Error: " +  err))

    // increment likes field in post
    await Post.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$inc: {numLikes: 1}});

    // append to likedUsers array in post
    await Post.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$push: {likedUsers: req.body.username}});
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
      likedPostIds = [...new Set(likedPostIds.map((likedPostId) => likedPostId.postId.toString()))];
      console.log(likedPostIds.length);

      const likedPosts = await Post.find().where("_id", likedPostIds).exec();
      console.log(likedPosts.length);

      let likedUsersByPostId = {}
      for (likedPostId of likedPostIds) {
        likedUsersByPostId[likedPostId.toString()] = (
          await Like.find()
            .where("postId", likedPostId)
            .select("username -_id")
            .exec()
        ).map((likes) => likes.username);
      }
      console.log(likedUsersByPostId);


    
      const responseBody = likedPosts.map(likedPost => ({
        _id: likedPost._id,
        text: likedPost.text,
        username: likedPost.username,
        anonymous: likedPost.anonymous,
        tags : likedPost.tags,
        datePosted: likedPost.createdAt,
        // numComments: likedPost.comments.length,
        numLikes: likedUsersByPostId[likedPost._id].length,
        title: likedPost.title,
        likedUsers: likedUsersByPostId[likedPost._id]
      }))

      res.status(200).send(responseBody);
    } catch (err) {
      console.log(err);
      res.send(500);
    }
  }
);



router.post(
  "/cleanup",
  async (req, res) => {

    try {
      // let likedPosts = await Like.find()
      //   .select("postId _id")
      //   .exec();
      // let likedPostIds = [...new Set(likedPosts.map((likedPost) => likedPost.postId.toString()))]
      // console.log(likedPostIds.length);

      // let validPostIds = await Post.find()
      //   .select("_id")
      //   .exec()
      // validPostIds = validPostIds.map((validPostId) => validPostId._id.toString());

      // console.log(validPostIds.length);

      // const notValidLikes = likedPostIds.filter(x => validPostIds.includes(x))
      // console.log(notValidLikes.length)

      // const result = await Like.deleteMany({postId: notValidLikes});
      // console.log(result);

      // let comments = await Comment.find()
      //   .select("postId _id")
      //   .exec();
      // let commentsPostIds = [...new Set(comments.map((likedPost) => likedPost.postId.toString()))]
      // console.log(commentsPostIds.length);

      // let validPostIds = await Post.find()
      //   .select("_id")
      //   .exec()
      // validPostIds = validPostIds.map((validPostId) => validPostId._id.toString());

      // console.log(validPostIds.length);

      // const notValidComments = commentsPostIds.filter(x => !validPostIds.includes(x))
      // console.log(notValidComments.length)

      // const result = await Comment.deleteMany({postId: notValidComments});
      // console.log(result);

      // for every like, update the post object its _id

      const likes = await Like.find();

      const likesByPost = likes.reduce((acc, curr) => {
        if (!acc[curr.postId]){
          acc[curr.postId] = [curr._id]
          return acc;
        }
        acc[curr.postId].push(curr._id)
        return acc;
      }, {});

      console.log(likesByPost)

      for(postId in likesByPost){
        console.log(likesByPost[postId])
        await Post.updateOne({_id: postId}, {$set: {likes: likesByPost[postId]}})
      }

      // console.log(likes)
      

      res.status(200).send();
    } catch (err) {
      console.log(err);
      res.send(500);
    }
  }
);

module.exports = router;
