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

app.get('/cipher', (req, res) => {
  const text = req.query.text.toUpperCase();
  const shift = parseInt(req.query.shift);

  if (!text || !shift) {
    return res.status(400).send('Both text and shift are required in query!');
  }

  const cipher = [];

  //Convert characters to UTF-16 numbers
  for (var i = 0; i < text.length; i++) {
    cipher[i] = text.charCodeAt(i);
  }

  //Shift letter by number in 'shift'; if Z, start from code that is 1 before A.
  for (var inx = 0; inx < text.length; inx++) {
    if (cipher[inx] === 90) {
      cipher[inx] = 64 + shift;
    } else {
      cipher[inx] = cipher[inx] + shift;
    }
  }

  //Return new numbers to letters.
  const message = cipher.map(letter => {
    return String.fromCharCode(letter);
  }).join('');

  return res.send(`Message: ${message}`);
});

app.listen(8000, () => {
  console.log('Express server listening on port 8000');
});