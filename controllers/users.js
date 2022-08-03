const {
  badRequest,
  pageNotFound,
  internalServerError,
} = require('../errors');

const User = require('../models/user');

const getUsers = (_, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(internalServerError).send({ message: 'На сервере произошла ошибка' }));
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
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(badRequest).send({ message: 'При создании пользователя переданы не верные данные' });
      }
      return res.status(internalServerError).send({ message: 'На сервере произошла ошибка' });
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
        res.status(internalServerError).send({ message: 'Ошибка на сервере' });
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
        res.status(internalServerError).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
