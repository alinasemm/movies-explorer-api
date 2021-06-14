const Movie = require('../models/movie');
const IncorrectDataError = require('../errors/incorrectDataError');
const AccessDeniedError = require('../errors/accessDeniedError');
const NotFoundError = require('../errors/notFoundError');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectDataError('Переданы некорректные данные при создании фильма'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail()
    .then((movie) => {
      if (req.user._id === movie.owner.toString()) {
        return Movie.findByIdAndRemove(req.params.id);
      }

      throw new AccessDeniedError('Нет прав для удаления фильма');
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Фильм по указанному _id не найден'));
        return;
      }
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные данные при удалении фильма'));
        return;
      }
      next(err);
    });
};
