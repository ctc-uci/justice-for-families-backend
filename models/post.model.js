const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required:true},
    text: {type: String, required: true},
    username: {type: String, required: true},
    anonymous: {type: Boolean, required: true},
    tags: {type: Array, required: true},
    datePosted: {type: Date, required:true},
    numComments: {type: Number, required: true},
    title: {type: String, required: true},
    media: {type: String, required: false}

  }, {
    timestamps: true,
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;