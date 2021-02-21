const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    text: {type: String, required: true},
    username: {type: String, required: true},
    anonymous: {type: Boolean, required: true},
    tags: {type: Array, required: true},
    datePosted: {type: Date, required:false},
    numComments: {type: Number, required: true},
    numLikes: {type:Number, required: true},
    title: {type: String, required: true},
    media: {type: String, required: false},
    likedUsers: {type: [String]}
  }, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;