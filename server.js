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

const postsRouter = require('./routes/posts');
const likesRouter = require('./routes/likes');
const commentRouter = require('./routes/comments');
const userRouter = require('./routes/users');
const authenticationRouter = require('./routes/authentication');
const tagsRouter = require('./routes/tags');
const activityRouter = require('./routes/activity');

app.use('/authentication', authenticationRouter);
app.use('/posts', postsRouter);
app.use('/likes', likesRouter);
app.use('/comments', commentRouter);
app.use('/users', userRouter);
app.use('/tags', tagsRouter);
app.use('/activity', activityRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.get('/',  (req, res) => {
  res.send("hello world");
})