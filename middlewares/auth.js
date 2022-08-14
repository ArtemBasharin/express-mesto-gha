/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');

const { authorizationError } = require('../errors');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(authorizationError).send({ message: 'Вам необходимо авторизоваться' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return res.status(authorizationError).send({ message: 'Вам необходимо авторизоваться' });
  }
  req.user = payload;

  next();
};
