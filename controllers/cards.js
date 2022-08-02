/* eslint-disable no-unused-vars */
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Ошибка на сервере' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const { owner } = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotFound' || err.name === 'CastError') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
      } else {
        res.status(500).send({ message: 'Ошибка на сервере' });
      }
    });
};
