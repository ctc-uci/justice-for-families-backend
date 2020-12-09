const router = require('express').Router()
const { MongoClient } = require('mongodb')

async function connect() {
    const uri = "mongodb+srv://allen:<password>@justiceforfamilies.nissu.mongodb.net/Database?retryWrites=true&w=majority"

    MongoClient.connect(uri, { useUnifiedTopology: true }, async function(err, client) {
        if (err) {
            console.log(err)
        } else {
            console.log("connection successful")
            const db = client.db("database")
            return db
        }
    })
}

async function insertUser(db, user) {
    db.collection("users").insertOne(user)
}

async function insertPost(db, post) {
    db.collection("posts").insertOne(post)
}

async function insertComment(db, comment) {
    db.collection("comments").insertOne(comment)
}

async function findUser(db, query) {
    const result = db.collection("users").find(query).toArray()
    return result
}

async function findPost(db, query) {
    db.collection("posts").find(query)
}

async function findComment(db, query) {
    db.collection("comments").find(query)
}

module.exports = router