// this file is for testing purposes only
const router = require('express').Router();
const { whetherEmailIsRegistered, getUserByEmail, getUserProfilePic } = require('../utils');

router.get('/testEmail', async function(req, res) {
    if (await whetherEmailIsRegistered(req.body.email)){
        res.status(200).send();
    }else{
        res.status(400).send();
    }
})

router.get('/getUser', async function(req, res) {
    res.send(await getUserByEmail(req.body.email))
})

module.exports = router;
