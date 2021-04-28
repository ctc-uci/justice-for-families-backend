const router = require("express").Router();
let Comment = require("../models/comment.model");
let Post = require("../models/post.model");
const { check, validationResult } = require("express-validator");

router
  .route("/")
  .post(
    [
      check("username")
        .isLength({ min: 1, max: 100 })
        .withMessage("Invalid username length, should be between 1, 100."),
      check("startingFrom")
        .optional()
        .isISO8601()
        .withMessage("Invalid datetime, should be ISO8601."),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.errors);
        return res.status(400).send(errors.errors);
      }

      const { username, startingFrom } = req.body;

      try {
        const posts = await Post.find()
          .where("username", username)
          .select("_id username text title")
          .exec();
        // console.log(posts);

        const postIds = posts.map((post) => post._id);
        // console.log(postIds);

        const commentsQuery = Comment.find();
        commentsQuery.where("postId", postIds);
        if (startingFrom) {
          commentsQuery.where("datePosted").gte(startingFrom);
        }
        commentsQuery.select("_id postId username datePosted text");
        const comments = await commentsQuery.exec();
        // console.log(comments);

        const postsMappedById = posts.reduce((acc, curr) => {
          acc[curr._id] = {
            username: curr.username,
            text: curr.text,
            title: curr.title,
          };
          return acc;
        }, {});
        // console.log(postsMappedById);

        const responseBody = {
          comments: comments.map((comment) => ({
            postID: comment.postId,
            postUsername: postsMappedById[comment.postId].username,
            postTitle: postsMappedById[comment.postId].title,
            postText: postsMappedById[comment.postId].text,
            commentID: comment._id,
            commentUsername: comment.username,
            commentDatePosted: comment.datePosted,
            commentText: comment.text,
          })),
        };
        // console.log(responseBody)

        res.status(200).send(responseBody);
      } catch (err) {
        console.log(err);
        res.status(500).send();
      }
    }
  );

module.exports = router;
