'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

//GET Sum endpoint
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

//GET /cipher endpoint
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

//GET /lotto endpoint
app.get('/lotto', (req, res) => {
  const numbers = req.query.numbers;

  const guesses = numbers
    .map(n => parseInt(n));

  if (numbers.length !== 6){
    return res.status(400).send('Must be 6 numbers!');
  }

  numbers.map( (number, index) => {
    if (numbers.indexOf(number) !== index) {
      return res.status(400).send('Must be distinct numbers!');
    }
  });

  numbers.map(number => {
    if (number < 1 || number > 20 ){
      return res.status(400).send('Numbers must be integers from 1-20!');
    }
  });

  // here are the 20 numbers to choose from
  const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

  //randomly choose 6
  const winningNumbers = [];
  for(let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran, 1);
  }

  //compare the guesses to the winning number
  let diff = winningNumbers.filter(n => !guesses.includes(n));

  // construct a response
  let responseText;

  switch(diff.length){
  case 0: 
    responseText = 'Wow! Unbelievable! You could have won the mega millions!';
    break;
  case 1:   
    responseText = 'Congratulations! You win $100!';
    break;
  case 2:
    responseText = 'Congratulations, you win a free ticket!';
    break;
  default:
    responseText = 'Sorry, you lose';  
  }

  return res.send(responseText);
});



app.listen(8000, () => {
  console.log('Express server listening on port 8000');
});