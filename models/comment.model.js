const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newCommentSchema = new Schema({
  _id: {type: Schema.Types.ObjectId},
  text: {type: String, required:true},
  username: {type: String, required:true},
  // numLikes: {type:Number, required:true}, // deprecated
  postId: {type:Schema.Types.ObjectId, required: true},
  // datePosted: {type: Date, required:false}, /// mongodb builtin _createby attribute, will remap _createdby to datePosted for compatability
  // likedUsers: {type: [String]} // deprecated
}, {
  timestamps: true
});

const commentSchema = new Schema({
  _id: {type: Schema.Types.ObjectId},
  text: {type: String, required:true},
  username: {type: String, required:true},
  numLikes: {type:Number, required:true},
  postId: {type:Schema.Types.ObjectId, required: true},
  datePosted: {type: Date, required:false},
  likedUsers: {type: [String]}
}, {
  timestamps: true
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;

