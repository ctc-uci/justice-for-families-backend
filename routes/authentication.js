const router = require('express').Router();
const Amplify = require('aws-amplify')
const { Auth } = require('aws-amplify')

Amplify.default.configure({
    Auth: {
        region: 'us-west-2',
        userPoolId: 'us-west-2_hUKpIERJA',
        userPoolWebClientId: '6a1ajlec5n4v7tuserdu8p01ql',
        mandatorySignIn: true,
    }
});

router.get('/', function(req, res) {
    res.send("authentication")
})

router.post('/register', async function(req, res) {
    const email = req.body.email
    const password = req.body.password
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
        })
    } catch (error) {
        console.log('error signing up:', error)
    }
})

router.post('/login', async function(req, res) {
    const email = req.body.email
    const password = req.body.password
    try {
        await Auth.signIn(email, password)
    } catch (error) {
        console.log('error signing in', error)
    }
})

router.post('/logout', async function(req, res) {
    try {
        await Auth.signOut()
        res.redirect('/login')
    } catch (error) {
        console.log('error signing out', error)
    }
})

router.post('/update/picture', async function(req, res) {
    const user = await Auth.currentAuthenticatedUser();
    const updatedAttribute = req.body.updatedAttribute
    try {
        await Auth.updateUserAttributes(user, {
            picture: updatedAttribute
        })
    } catch (error) {
        console.log('error updating attribute', error)
    }
})

router.post('/update/name', async function(req, res) {
    const user = await Auth.currentAuthenticatedUser();
    const updatedAttribute = req.body.updatedAttribute
    try {
        await Auth.updateUserAttributes(user, {
            Name: updatedAttribute
        })
    } catch (error) {
        console.log('error updating attribute', error)
    }
})

router.post('/update/phoneNumber', async function(req, res) {
    const user = await Auth.currentAuthenticatedUser();
    const updatedAttribute = req.body.updatedAttribute
    try {
        await Auth.updateUserAttributes(user, {
            phone_number: updatedAttribute
        })
    } catch (error) {
        console.log('error updating attribute', error)
    }
})

router.post('/update/preferredUserName', async function(req, res) {
    const user = await Auth.currentAuthenticatedUser();
    const updatedAttribute = req.body.updatedAttribute
    try {
        await Auth.updateUserAttributes(user, {
            preferred_username: updatedAttribute
        })
    } catch (error) {
        console.log('error updating attribute', error)
    }
})

module.exports = router
