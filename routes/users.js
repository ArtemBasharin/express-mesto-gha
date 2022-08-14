const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', auth, getUsers);
router.get('/users/:userId', auth, getUserById);
router.post('/users', auth, createUser);
router.patch('/users/me', auth, updateUserInfo);
router.patch('/users/me/avatar', auth, updateUserAvatar);

module.exports = router;
