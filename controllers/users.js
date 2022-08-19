const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PageNotFound = require('../errors/PageNotFound');
const BadReqErr = require('../errors/BadReqErr');
const AuthErr = require('../errors/AuthErr');
const ConflictReqErr = require('../errors/ConflictReqErr');

const User = require('../models/user');

const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new PageNotFound('Пользователь не найден'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadReqErr('Передан неверный id пользователя'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadReqErr('При обновлении данных пользователя переданы неверные данные'));
      }
      if (err.code === 11000) {
        return next(new ConflictReqErr('Пользователь с таким email уже существует'));
      }
      return next(err);
    });
};

const updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        return next(new PageNotFound('Пользователь не найден'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadReqErr('При обновлении данных пользователя переданы неверные данные'));
      }
      return next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        return next(new PageNotFound('Пользователь не найден'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadReqErr('При обновлении данных пользователя переданы неверные данные'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => next(new AuthErr('Неправильные почта или пароль')));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new PageNotFound('Пользователь не найден'));
      }
      return res.send({ data: user });
    })
    .catch((err) => next(err));
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
