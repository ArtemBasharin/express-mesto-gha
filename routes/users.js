const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

const {
  validateUserId,
  validateUpdateUser,
  validateAvatar,
} = require('../middlewares/validation');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', validateUserId, getUserById);
router.patch('/users/me', validateUpdateUser, updateUserInfo);
router.patch('/users/me/avatar', validateAvatar, updateUserAvatar);

module.exports = router;
