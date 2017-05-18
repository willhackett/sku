const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

const app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,X-Seek-site'
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

router.get('/test', (req, res) => {
  res.status(200).json(require('./payloads/test-valid.json'));
});

app.use('/', router);

app.listen(7778);
