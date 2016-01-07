var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var route = require('./route');

console.log('Initialize cairo-worker service');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.get('/document', route.convertDocument);
app.post('/document', route.convertDocument);

app.listen(3121, function(err) {
  if (err) console.error('Failed to run service', err.stack);
  else console.info('Service listening at http://localhost:%s', 3121);
});
