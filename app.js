const express = require('express');
const user = require('./ routes/users');
const movies = require('./ routes/movies');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');

const app = express();

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, user);
app.use('/movies', auth, movies);
