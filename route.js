// Render a vega chart using JSON input then send result to HTTP response

var vega = require('vega');
var vegaLite = require('vega-lite');
var Ajv = require('ajv');
var ajv = new Ajv();

var validateVegaLite = ajv.compile(require('./node_modules/vega-lite/vega-lite-schema.json'));
//var validateVega = ajv.compile(require('./node_modules/vega/vega-schema.json'));

exports.convertDocument = function(req, res) {
  var outputType = req.get('accept').split(';')[0];

  var spec, valid;
  if (req.query.chartlib === 'vega') {
    spec = req.body;
  } else {
    valid = validateVegaLite(req.body);
    if (!valid) {
      return res.status(400)
        .send('Failed to validate vega-lite input:' + JSON.stringify(validateVegaLite.errors, null, 2));
    }

    try {
      spec = vegaLite.compile(req.body).spec;
    } catch (err) {
      return res.status(400).send('Failed to compile vega-lite JSON input into a vega document:' + err.stack);
    }
  }

  /* No schema validation for now. It seems that some valid vega inputs are rejected.
  Bad schema, ajv problem ?
  valid = validateVega(spec);
  if (!valid) {
    return res.status(400).send('Failed to validate vega input:' + JSON.stringify(validateVega.errors, null, 2));
  }*/

  res.set('Content-Type', outputType);
  vega.parse.spec(spec, function(chart) {

    if (outputType === 'image/svg+xml') {
      return res.send(chart({
        renderer: 'svg'
      }).update().svg());
    }

    var canvas = chart({
      renderer: 'canvas'
    }).update().canvas();

    if (outputType === 'image/png') {
      return canvas.pngStream().pipe(res);
    }

    if (outputType === 'image/jpeg') {
      return canvas.jpegStream().pipe(res);
    }

    res.status(400)
      .send('Output type ' + outputType + ' not supported. Expect "image/svg+xml", "image/png" or "image/jpeg".');
  });
};
