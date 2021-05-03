const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  _id: {type: mongoose.Schema.Types.ObjectId},
  text: {type: String, required: true},
  username: {type: String, required: true},
  anonymous: {type: Boolean, required: true},
  tags: {type: [String], required: true},  // updated schema
  // datePosted: {type: Date, required:false},  // mongodb builtin _createdby attribute, will remap _createdby to datePosted for compatability
  comments: {type: [Schema.Types.ObjectId]}, // SQL-like relation
  // numComments: {type: Number, required: true}, // computable from comments.length
  // numLikes: {type:Number, required: true}, // computable from likedUsers.length
  title: {type: String, required: true},
  // media: {type: String, required: false}, // deprecated
  likes: {type: [Schema.Types.ObjectId]}, // keep it consistent with comments, seperating is better for "find all posts a particular liked" query
}, {
  timestamps: true,
});

// const postSchema = new Schema({
//     _id: {type: mongoose.Schema.Types.ObjectId},
//     text: {type: String, required: true},
//     username: {type: String, required: true},
//     anonymous: {type: Boolean, required: true},
//     tags: {type: Array, required: true},
//     datePosted: {type: Date, required:false},
//     numComments: {type: Number, required: true},
//     numLikes: {type:Number, required: true},
//     title: {type: String, required: true},
//     media: {type: String, required: false},
//     likedUsers: {type: [String]}
//   }, {
//     timestamps: true,
// });

const Post = mongoose.model('Post', postSchema);
module.exports = Post;