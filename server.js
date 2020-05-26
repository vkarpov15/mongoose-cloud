const cors = require('cors');
const express = require('express');
const cloud = require('./');

const app = express();
app.use(cors());
app.use(express.json());

const functions = require('bulk-require')(__dirname, ['api/*.js']);
Object.keys(functions).forEach(key => {
  const fn = functions[key];

  app.post(`/api/${key}`, function(req, res) {
    const params = { ...req.query, ...req.body, ...req.params };
    fn(params).
      then(obj => res.json(obj)).
      catch(err => {
        res.status(err.status || 500).json({ message: err.message, stack: err.stack });
      });
  });
});

app.listen(3000);
console.log('App listening on port 3000');
