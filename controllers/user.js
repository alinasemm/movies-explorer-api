const User = require('../models/user');

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUserInformation = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user, { name, email }, { new: true, runValidators: true })
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