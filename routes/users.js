const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/user.model');

router.post('/create', function(req, res) {
    query = {
        "_id": new mongoose.Types.ObjectId(),
        "username": req.body.username
    }
    const newUser = new User(query);
    newUser.save()
    .then(() => res.status(200).send("new user created"))
    .catch(err => res.status(400).json("Error: " +  err))
});

module.exports = router;