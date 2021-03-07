const router = require('express').Router();
const Amplify = require('aws-amplify');
const { Auth } = require('aws-amplify');

Amplify.default.configure({
    Auth: {
        region: 'us-west-2',
        userPoolId: 'us-west-2_hUKpIERJA',
        userPoolWebClientId: '6a1ajlec5n4v7tuserdu8p01ql',
        mandatorySignIn: true,
    }
});

router.get('/', function(req, res) {
    res.send("authentication");
})

router.post('/changePassword', async function(req, res) {
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

router.post('/register', async function(req, res) {
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

router.post('/login', async function(req, res) {
    const email = req.body.email
    const password = req.body.password
    try {
        await Auth.signIn(email, password)
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/logout', async function(req, res) {
    try {
        await Auth.signOut()
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/update/picture', async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const picture = req.body.picture;
    const user = await Auth.signIn(username, password);
    try {
        await Auth.updateUserAttributes(user, {
            picture: picture
        })
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/update/name', async function(req, res) {
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

router.post('/update/phoneNumber', async function(req, res) {
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

module.exports = router;
