const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// deprecate the entire user.model, likedPosts per username is computable from Like.model

const userSchema = new Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true},
    username: {type: String, required: true},
    likedPosts: {type: [mongoose.Schema.Types.ObjectId]}
});

const User = mongoose.model('users', userSchema);
module.exports = User;
