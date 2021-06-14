require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./ routes');

mongoose.set('toObject', { useProjection: true });
mongoose.set('toJSON', { useProjection: true });

const { NODE_ENV, DATABASE_URL } = process.env;
const databaseUrl = NODE_ENV === 'production' ? DATABASE_URL : 'mongodb://localhost:27017/bitfilmsdb';

mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const app = express();
app.use(express.json());
app.use(requestLogger);

app.use(routes);

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    message: err.statusCode ? err.message : 'На сервере произошла ошибка',
  });
  next();
});

app.listen(3001);
