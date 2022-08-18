const BadReqErr = require('../errors/BadReqErr');
const PageNotFound = require('../errors/PageNotFound');
const ForbidErr = require('../errors/ForbidErr');

const Card = require('../models/card');

const getCards = (_, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadReqErr('Данные новой карточки невалидны'));
      }
      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  return Card.findById(cardId)
    .orFail(() => {
      throw new PageNotFound('Карточка не найдена');
    })
    .then((card) => {
      if (card.owner.equals(req.user._id)) {
        return Card.findByIdAndRemove(cardId).then(() => res.send(card));
      }
      return next(new ForbidErr('Невозможно удалить чужую карточку'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadReqErr('Передан некорректный id карточки'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return next(new PageNotFound('Карточка не найдена'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadReqErr('Передан некорректный id карточки'));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return next(new PageNotFound('Карточка не найдена'));
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadReqErr('Передан некорректный id карточки'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
