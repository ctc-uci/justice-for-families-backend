const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    username: {type: String, required: true},
    date: {type: Date},
    postId: {type: mongoose.Schema.Types.ObjectId, required: true}
})

const Like = mongoose.model('likes', likeSchema);
module.exports = Like;
