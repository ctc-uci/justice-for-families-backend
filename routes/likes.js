const router = require('express').Router()
const mongoose = require('mongoose');
const Like = require('../models/like.model');
const Post = require('../models/post.model');
const Comment= require('../models/comment.model');


router.post('/like', function(req, res) {
    query = {
        "_id": new mongoose.Types.ObjectId(),
        "username": req.body.username,
        "date": new Date(),
        "postId": new mongoose.Types.ObjectId(req.body.postId)
    }
    const newLike = new Like(query);
    newLike.save()
    .then(() => res.status(200).send("liked"))
    .catch(err => res.status(400).json("Error: " +  err))

    Post.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$inc: {likes: 1}}, function(err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("updated: ", docs);
        }
    });
});

router.post('/unlike', function(req, res) {
    Like.deleteOne({_id: new mongoose.Types.ObjectId(req.body.id)}).then(function() {
        res.status(200).send("like deleted");
    }).catch(function(error) {
        res.status(400).send(error);
    });
    Post.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$inc: { likes: -1}}, function(err, docs) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(200).send("unliked");
        }
    });
});


router.post('/likeComment', function(req, res) {
    query = {
        "_id": new mongoose.Types.ObjectId(),
        "username": req.body.username,
        "date": new Date(),
        "postId": new mongoose.Types.ObjectId(req.body.postId),
    }
    const newLike = new Like(query);
    newLike.save()
    .then(() => res.status(200).send("liked"))
    .catch(err => res.status(400).json("Error: " +  err))

    Comment.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$inc: {numLikes: 1}},{$push: {likedBy: req.body.username}} function(err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("updated: ", docs);
        }
    });
});

router.post('/unlikeComment', function(req, res) {
    Like.deleteOne({_id: new mongoose.Types.ObjectId(req.body.id)}).then(function() {
        res.status(200).send("like deleted");
    }).catch(function(error) {
        res.status(400).send(error);
    });
    Comment.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$inc: { numLikes: -1}},{$pull: {likedBy:req.body.username}}, function(err, docs) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            res.status(200).send("unliked");
        }
    });
});




module.exports = router;
