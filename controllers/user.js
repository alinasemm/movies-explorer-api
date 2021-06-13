const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const IncorrectDataError = require('../errors/incorrectDataError');
const InvalidCredentialsError = require('../errors/invalidCredentialsError');
const NotFoundError = require('../errors/notFoundError');
const DuplicateDataError = require('../errors/duplicateDataError');

function isDuplicate(err) {
  return err.name === 'MongoError' && err.code === 11000;
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key';
      const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new InvalidCredentialsError('Неверный логин или пароль'));
    });
};

module.exports.getUser = (req, res, next) => {
  let { userId } = req.params;
  if (userId === 'me') {
    userId = req.user._id;
  }
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
        return;
      }

      if (err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные данные при возврате пользователя по _id'));
        return;
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => User.create({
      name,
      email,
      password: hashedPassword,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при создании пользователя'));
        return;
      }

      if (isDuplicate(err)) {
        next(new DuplicateDataError('Такой email уже существует'));
        return;
      }

      next(err);
    });
};

module.exports.updateUserInformation = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Такой пользователь не найден'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (['CastError', 'ValidationError'].includes(err.name)) {
        next(new IncorrectDataError('Переданы некорректные данные при обновлении информации о пользователе.'));
        return;
      }

      if (isDuplicate(err)) {
        next(new DuplicateDataError('Такой email уже существует'));
        return;
      }

      next(err);
    });
};
