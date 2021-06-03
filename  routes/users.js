const router = require('express').Router();
const { getUser, updateUserInformation } = require('../controllers/user');

router.get('/users/me', getUser);

router.patch('/users/me', updateUserInformation);

module.exports = router;
