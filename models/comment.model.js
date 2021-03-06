const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

