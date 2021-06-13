const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const user = require('./users');
const movies = require('./movies');
const { login, createUser } = require('../controllers/user');
const NotFoundError = require('../errors/notFoundError');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use('/users', auth, user);
router.use('/movies', auth, movies);

router.get('/crash-test', auth, () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.use(auth, (req, res, next) => {
  next(new NotFoundError('Ресурс запроса не найден'));
});

module.exports = router;
