const express = require('express');
const user = require('./ routes/users');
const movies = require('./ routes/movies');
const auth = require('./middlewares/auth');

const app = express();

app.use('/users', auth, user);
app.use('/movies', auth, movies);
