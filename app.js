const express = require('express');
const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '62e4d6ae4f243c05bb044669',
  };

  next();
});

app.use(usersRouter);
app.use(cardsRouter);

app.use('/', (req, res) => {
  res.status(404).send({ message: 'Произошла ошибка' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
