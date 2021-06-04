const User = require('../models/user');

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

module.exports.updateUserInformation = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({
          message: 'Такой пользователь не найден',
        });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (['CastError', 'ValidationError'].includes(err.name)) {
        next(new IncorrectDataError('Переданы некорректные данные при обновлении информации о пользователе.'));
        return;
      }
      next(err);
    });
};