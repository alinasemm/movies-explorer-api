const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUser, updateUserInformation } = require('../controllers/user');

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().email().required(),
  }),
}), updateUserInformation);

module.exports = router;
