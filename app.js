/* eslint-disable no-unused-vars */
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');//
const cardsRouter = require('./routes/cards');//
const auth = require('./middlewares/auth');
const errHandler = require('./middlewares/errHandler');
const { validateLogin, validateUser } = require('./middlewares/validation');
const PageNotFound = require('./errors/PageNotFound');
const { login, createUser } = require('./controllers/users');//

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(errors());
app.use(helmet());
app.post('/signin', validateLogin, login);
app.post('/signup', validateUser, createUser);
app.use(auth);
app.use(usersRouter);
app.use(cardsRouter);
app.use(errHandler);

app.use('/', (req, res, next) => {
  next(new PageNotFound('Страница не найдена'));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
