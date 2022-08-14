const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  badRequest,
  pageNotFound,
  internalServerError,
  authorizationError,
} = require('../errors');

const User = require('../models/user');

const getUsers = (_, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(internalServerError).send({ message: 'Внутренняя ошибка сервера' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(pageNotFound).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Передан не верный id пользователя' });
      }
      return res.status(internalServerError).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'При создании пользователя переданы не верные данные' });
      }
      return res.status(internalServerError).send({ message: 'Внутренняя ошибка сервера' });
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId' || err.name === 'CastError') {
        res.status(pageNotFound).send({ message: 'Пользователь с указанным id не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(internalServerError).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId' || err.name === 'CastError') {
        res.status(pageNotFound).send({ message: 'Пользователь с указанным id не найден' });
      } else if (err.name === 'ValidationError') {
        res.status(badRequest).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else {
        res.status(internalServerError).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          return res.send({ token });
        });
    })
    .catch(() => {
      res.status(authorizationError).send({ message: 'Неправильные почта или пароль' });
    });
};

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(pageNotFound).send({ message: 'Пользователь с указанным id не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(badRequest).send({ message: 'Пользователь с указанным id не найден' });
      }
      return res.status(internalServerError).send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
  getCurrentUser,
};
