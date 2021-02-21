const router = require('express').Router();
const mongoose = require('mongoose');
const Like = require('../models/like.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');

router.post('/like', function(req, res) {
    query = {
        "_id": new mongoose.Types.ObjectId(),
        "username": req.body.username,
        "date": new Date(),
        "postId": new mongoose.Types.ObjectId(req.body.postId)
    }
    const newLike = new Like(query);
    newLike.save().then(() => res.status(200).send("liked")).catch(err => res.status(400).json("Error: " +  err))

    // increment likes field in post
    Post.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$inc: {numLikes: 1}}, function(err, docs) {
        if (err) {
            console.log(err);
        }
    });

    // append to likedUsers array in post
    Post.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$push: {likedUsers: req.body.username}}, function(err, docs) {
        if (err) {
            console.log(err);
        }
    });

    // append to likedPosts in user
    User.updateOne({username: req.body.username}, {$push: {likedPosts: req.body.postId}}, function(err, docs) {
        if (err) {
            console.log(err);
        }
    });
});

router.post('/unlike', function(req, res) {
    // delete like
    Like.deleteOne({_id: new mongoose.Types.ObjectId(req.body.id)}).then(function() {
        res.status(200).send("like deleted");
    }).catch(function(error) {
        res.status(400).send(error);
    });

    // decrement likes field in post
    Post.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$inc: { numLikes: -1}}, function(err, docs) {
        if (err) {
            res.status(400).send(err);
        }
    });

    // remove from likedUsers array in post
    Post.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$pull: {likedUsers: req.body.username}}, function(err, docs) {
        if (err) {
            console.log(err);
        }
    });

    // remove from likedPosts in user
    User.updateOne({username: req.body.username}, {$pull: {likedPosts: req.body.postId}}, function(err, docs) {
        if (err) {
            console.log(err);
        }
    });
});

module.exports = router;
