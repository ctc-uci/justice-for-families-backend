const router = require('express').Router()
const mongoose = require('mongoose');
const Like = require('../models/like.model');
const Post = require('../models/post.model');

router.post('/like', function(req, res) {
    query = {
        "_id": new mongoose.Types.ObjectId(),
        "user": req.body.user,
        "date": new Date(),
        "postId": new mongoose.Types.ObjectId(req.body.postId)
    }
    const newLike = new Like(query);
    newLike.save()
    .then(() => res.send("liked"))
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
        res.send("like deleted");
    }).catch(function(error) {
        res.send(error);
    });
    Post.updateOne({_id: new mongoose.Types.ObjectId(req.body.postId)}, {$inc: { likes: -1}}, function(err, docs) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("unliked");
        }
    });
});

module.exports = router;