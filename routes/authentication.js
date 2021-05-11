const router = require('express').Router();
const Amplify = require('aws-amplify');
const { Auth } = require('aws-amplify');
const AwsSdk = require("aws-sdk");
const { getUserByEmail, getUserProfilePic } = require('../utils');
const { check, validationResult } = require('express-validator');

Amplify.default.configure({
    Auth: {
        region: process.env.AWS_REGION,
        userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
        userPoolWebClientId: process.env.AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
        mandatorySignIn: true,
    }
});

AwsSdk.config.setPromisesDependency();
AwsSdk.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

router.get('/', function (req, res) {
    res.send("authentication");
})

router.post('/changePassword', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const user = await Auth.signIn(username, password);
    try {
        await Auth.changePassword(user, password, newPassword);
        res.status(200).send("password changed");
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/register', async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    try {
        await Auth.signUp({
            username: email,
            password: password,
            attributes: {
                picture: '',
                preferred_username: '',
                name: '',
                phone_number: ''
            }
        });
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/login', async function (req, res) {
    const email = req.body.email
    const password = req.body.password
    try {
        await Auth.signIn(email, password)
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/logout', async function (req, res) {
    try {
        await Auth.signOut()
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/update/picture', async function (req, res) {
    const email = req.body.email;
    const picture = req.body.picture;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            res.status(400).send("Could not find user");
            return;
        }

        const cognito = new AwsSdk.CognitoIdentityServiceProvider();
        const params = {
            UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
            Username: user.Username,
            UserAttributes: [{
                Name: 'picture',
                Value: picture
            }, ],
        };
        await cognito.adminUpdateUserAttributes(params).promise();
        res.status(200).send();
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/update/name', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const user = await Auth.signIn(username, password);
    try {
        await Auth.updateUserAttributes(user, {
            name: name
        })
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/update/phoneNumber', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const phoneNumber = req.body.phoneNumber;
    const user = await Auth.signIn(username, password);
    try {
        await Auth.updateUserAttributes(user, {
            phone_number: phoneNumber
        })
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/profilepic/get',
    [
        check("email")
        .notEmpty()
        .withMessage("Invalid email, should not be empty")
        .isLength({
            min: 1,
            max: 100
        })
        .withMessage("Invalid email length, should be between 1, 100."),
    ], async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array(),
            });
        }
        const pfp = await getUserProfilePic(req.body.email);
        return pfp.error ? res.status(400).send(pfp) : res.status(200).send(pfp);
    })

module.exports = router;