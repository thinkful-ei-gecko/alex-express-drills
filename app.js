'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/sum', (req, res) => {
  const a = req.query.a;
  const b = req.query.b;

  if(!a || !b) {
    return res.status(400).send('Two integers must be included in query!');
  }

  const sum = parseInt(a) + parseInt(b)
  res.send(`
    The sum of ${a} and ${b} is ${JSON.stringify(sum)}.
  `);
});

app.listen(8000, () => {
  console.log('Express server listening on port 8000');
});