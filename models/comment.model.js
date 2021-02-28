const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  _id: {type: Schema.Types.ObjectId, required: true},
  text: {type: String, required:true},
  username: {type: String, required:true},
  numLikes: {type:Number, required:true},
  postId: {type:Schema.Types.ObjectId, required: true},
  datePosted: {type: Date, required:false},
  likedBy: {type:Array, required:true}
}, {
  timestamps: true
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;

