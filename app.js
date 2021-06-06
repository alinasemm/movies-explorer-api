const express = require('express');
const mongoose = require('mongoose');
const user = require('./ routes/users');
const movies = require('./ routes/movies');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/notFoundError');

const app = express();

///временно!
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, user);
app.use('/movies', auth, movies);

app.use((req, res, next) => {
  next(new NotFoundError('Ресурс запроса не найден'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    message: err.message || 'На сервере произошла ошибка',
  });
});

///временно!
app.listen(3000);
