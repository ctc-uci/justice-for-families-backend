const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});
const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established!");
});

// posts router
const postsRouter = require('./routes/posts');
// likes router
const likesRouter = require('./routes/likes');

app.use('/authentication', require('./routes/authentication'));
// app.use('/database', require('./routes/database'));
app.use('/posts', postsRouter);
app.use('/likes', likesRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.get('/',  (req, res) => {
  res.send("hello world");
})