/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');

const {
  badRequest,
  pageNotFound,
  internalServerError,
} = require('./errors');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(usersRouter);
app.use(cardsRouter);
app.post('/signin', login);
app.post('/signup', createUser);

app.use('/', (_, res) => {
  res.status(pageNotFound).send({ message: 'Произошла ошибка' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
