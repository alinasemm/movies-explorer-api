const router = require('express').Router();
const { getUser, updateUserInformation } = require('../controllers/user');

router.get('/:userId', getUser);
router.patch('/me', updateUserInformation);

module.exports = router;
