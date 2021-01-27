const express = require('express')
const app = express()

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

app.get('/', function(req, res) {
    res.send("login server")
})

app.post('/register', async function(req, res) {
    const email = req.body.email
    const password = req.body.password
    try {
        const user = await Auth.signUp({
            username: email,
            password: password,
            attributes: {
                picture: '',
                preferred_username: '',
                name: '',
                phone_number: ''
            }
        })
        res.sendStatus(200) // OK
        res.redirect('/login')
        console.log(user)
    } catch (error) {
        console.log('error signing up:', error)
        res.sendStatus(500) // server error
    }
})

app.post('/login', async function(req, res) {
    const email = req.body.email
    const password = req.body.password
    try {
        await Auth.signIn(email, password)
        res.sendStatus(200) // OK
        res.redirect('/logout')
    } catch (error) {
        console.log('error signing in', error)
        res.sendStatus(500) // server error
    }
})

app.post('/logout', async function(req, res) {
    try {
        await Auth.signOut()
        res.sendStatus(200) // OK
        res.redirect('/login')
    } catch (error) {
        console.log('error signing out', error)
        res.sendStatus(500) // server error
    }
})

app.post('/updatePicture', async function(req, res) {
    const user = await Auth.currentAuthenticatedUser();
    const updatedAttribute = req.body.updatedAttribute
    try {
        const result = await Auth.updateUserAttributes(user, {
            picture: updatedAttribute
        })
        console.log(result);
        res.sendStatus(200) // OK
    } catch (error) {
        console.log('error updating attribute', error)
        res.sendStatus(500) // server error
    }
})

app.post('/updateName', async function(req, res) {
    const user = await Auth.currentAuthenticatedUser();
    const updatedAttribute = req.body.updatedAttribute
    try {
        const result = await Auth.updateUserAttributes(user, {
            Name: updatedAttribute
        })
        console.log(result);
        res.sendStatus(200) // OK
    } catch (error) {
        console.log('error updating attribute', error)
        res.sendStatus(500) // server error
    }
})

app.post('/updatePhoneNumber', async function(req, res) {
    const user = await Auth.currentAuthenticatedUser();
    const updatedAttribute = req.body.updatedAttribute
    try {
        const result = await Auth.updateUserAttributes(user, {
            phone_number: updatedAttribute
        })
        console.log(result);
        res.sendStatus(200) // OK
    } catch (error) {
        console.log('error updating attribute', error)
        res.sendStatus(500) // server error
    }
})

app.post('/updatePreferredUserName', async function(req, res) {
    const user = await Auth.currentAuthenticatedUser();
    const updatedAttribute = req.body.updatedAttribute
    try {
        const result = await Auth.updateUserAttributes(user, {
            preferred_username: updatedAttribute
        })
        console.log(result);
        res.sendStatus(200) // OK
    } catch (error) {
        console.log('error updating attribute', error)
        res.sendStatus(500) // server error
    }
})

app.listen(3000)
