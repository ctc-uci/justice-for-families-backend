const express = require("express");
const { v4: uuid } = require("uuid");
const aws = require("aws-sdk");
const { validationResult, query } = require("express-validator");
const router = express.Router();

router.route("/").get(
  [
    query("contentType")
      .exists()
      .withMessage("required")
      .bail()
      .isIn(["image/jpeg", "image/png"]) // Can support more MIME types as needed
      .withMessage("Unsupported contentType, currently support 'image/jpeg', 'image/png'"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array(),
      });
    }

    const { contentType } = req.query;

    try {
      aws.config.setPromisesDependency();
      aws.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      });

      const s3 = new aws.S3();
      const fileExtention = `profilePics/${uuid()}`;

      const s3Params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileExtention,
        Expires: 300,
        ContentType: contentType,
        ACL: "public-read", // Anyone can view image as url, do not use for sensitive images
      };

      const uploadURL = s3.getSignedUrl("putObject", s3Params);
      const path = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileExtention}`

      res.send({ uploadURL, path});
    } catch (err) {
      console.log(err);
      res.send(500);
    }
  }
);

module.exports = router;
