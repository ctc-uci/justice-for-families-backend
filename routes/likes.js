const router = require('express').Router();
const mongoose = require('mongoose');
const {
  check,
  validationResult
} = require('express-validator');
const Like = require('../models/like.model');
const Post = require('../models/post.model');
const User = require('../models/user.model');

router.route('/like').post([
  check('username').notEmpty().withMessage("Invalid username, should not be empty"),
  check('username').isLength({
    min: 1,
    max: 100
  }).withMessage("Invalid username length, should be between 1, 100."),
  check('postId').notEmpty().withMessage("Invalid post id, should not be empty")
], async function (req, res) {
  query = {
    "_id": new mongoose.Types.ObjectId(),
    "username": req.body.username,
    "date": new Date(),
    "postId": new mongoose.Types.ObjectId(req.body.postId)
  }

  var foundLike = false;

  await Like.findOne({
    $and: [{
        "username": req.body.username
      },
      {
        "postId": req.body.postId
      }
    ]
  }, (err, docs) => {
    if (docs) {
      foundLike = true;
      res.status(400).json({
        errMsg: "error, like was already found",
        likeDoc: docs,
      })
    }
  });

  if (!foundLike) {
    const newLike = new Like(query);
    await newLike.save().then(() => res.status(200).send("liked")).catch(err => res.status(400).json("Error: " + err))

    // increment likes field in post
    await Post.updateOne({
      _id: new mongoose.Types.ObjectId(req.body.postId)
    }, {
      $inc: {
        numLikes: 1
      }
    });

    // append to likedUsers array in post
    await Post.updateOne({
      _id: new mongoose.Types.ObjectId(req.body.postId)
    }, {
      $push: {
        likedUsers: req.body.username
      }
    });

    // append to likedPosts in user
    await User.updateOne({
      username: req.body.username
    }, {
      $push: {
        likedPosts: req.body.postId
      }
    });
  }
});


router.route('/unlike').post([
  check('username').notEmpty().withMessage("Invalid username, should not be empty"),
  check('username').isLength({
    min: 1,
    max: 100
  }).withMessage("Invalid username length, should be between 1, 100."),
  check('postId').notEmpty().withMessage("Invalid post id, should not be empty"),
], async function (req, res) {
  // check for errs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: errors.array()
    })
  }

  var likeNotFound = false;

  await Like.findOne({
    $and: [{
        "username": req.body.username
      },
      {
        "postId": req.body.postId
      }
    ]
  }, (err, docs) => {
    if (!docs) {
      likeNotFound = true;
      res.status(400).json({
        errMsg: "error, could not find like",
        likeDoc: docs,
      })
    } else {
      res.status(200).json(docs);
    }
  });

  if (!likeNotFound) {
    // delete like
    await Like.deleteOne({
      $and: [{
          "username": req.body.username
        },
        {
          "postId": req.body.postId
        }
      ]
    }).then(function () {
      res.status(200).send("like deleted");
    }).catch(function (error) {
      res.status(400).send(error);
    });

    // decrement likes field in post
    await Post.updateOne({
      _id: new mongoose.Types.ObjectId(req.body.postId)
    }, {
      $inc: {
        numLikes: -1
      }
    });

    // remove from likedUsers array in post
    await Post.updateOne({
      _id: new mongoose.Types.ObjectId(req.body.postId)
    }, {
      $pull: {
        likedUsers: req.body.username
      }
    });

    // remove from likedPosts in user
    await User.updateOne({
      username: req.body.username
    }, {
      $pull: {
        likedPosts: req.body.postId
      }
    });
  }
});

router.post(
  "/byUser",
  [
    check("username")
    .isLength({
      min: 1,
      max: 100
    })
    .withMessage("Invalid username length, should be between 1, 100."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array(),
      });
    }

    const {
      username
    } = req.body;

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