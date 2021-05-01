const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newLikeSchema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    username: {type: String, required: true},
    // date: {type: Date}, // mongodb builtin _createby attribute, will remap _createdby to date for compatability
    postId: {type: mongoose.Schema.Types.ObjectId, required: true}
})

const likeSchema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    username: {type: String, required: true},
    date: {type: Date},
    postId: {type: mongoose.Schema.Types.ObjectId, required: true}
})

const Like = mongoose.model('likes', likeSchema);
module.exports = Like;
