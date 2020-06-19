#!/usr/bin/env node
const bodyParser = require('body-parser');
const chalk = require('chalk');
const cors = require('cors');
const express = require('express');
const cloud = require('./');

const app = express();
app.use(cors());
app.use(express.json());

const functions = require('bulk-require')(`${process.cwd()}/api`, ['*.js']);
Object.keys(functions).forEach(key => {
  const fn = functions[key];

  if (fn.$__type === 'LAMBDA') {
    console.log(`Mounted POST /api/${key} (LAMBDA)`);
    app.post(`/api/${key}`, bodyParser.text({ type: () => true }), function(req, res) {
      const params = { body: req.body };
      fn(params).
        then(obj => res.json(obj)).
        catch(err => {
          res.status(err.status || 500).json({ message: err.message, stack: err.stack });
        });
    });
  } else {
    console.log(`Mounted POST /api/${key}`);
    app.post(`/api/${key}`, express.json(), function(req, res) {
      const params = { ...req.query, ...req.body, ...req.params };
      console.log(chalk.blue(`${new Date().toISOString()} POST /api/${key}`), params);
      fn(params).
        then(obj => res.json(obj)).
        catch(err => {
          console.log(chalk.red(`ERROR: POST /api/${key}`));
          console.log(err.stack);
          res.status(err.status || 500).json({ message: err.message, stack: err.stack });
        });
    });
  }
});

app.listen(3000);
console.log('App listening on port 3000');

