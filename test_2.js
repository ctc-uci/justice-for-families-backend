const express = require('express');
const app = express();

app.use('/authentication', require('./routes/authentication'));
app.use('/database', require('./routes/database'));

app.listen(3000);