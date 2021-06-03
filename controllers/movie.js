const Movie = require('../models/movie');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user })
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
  Movie.findById(req.params.movieId)
    .orFail()
    .then((movie) => {
      if (req.user === movie.owner.toString()) {
        return Movie.findByIdAndRemove(req.params.movieId);
      }

      throw new AccessDeniedError();
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'AccessDeniedError') {
        next(err);
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка по указанному _id не найдена'));
        return;
      }
      if (err.name === 'CastError') {
        next(new IncorrectDataError('Переданы некорректные данные при удалении карточки'));
        return;
      }
      next(err);
    });
};
