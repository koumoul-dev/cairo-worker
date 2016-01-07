var fs = require('fs');
var should = require('should');
var request = require('request');

function documentAPI(options, callback) {
  options.url = 'http://localhost:3121/document';
  options.encoding = null;

  request.post(options, function(err, response) {
    if (err) return callback(err);
    if (response.statusCode !== 200) {
      err = new Error(response.body);
      err.code = response.statusCode;
      return callback(err);
    }

    var result = response.body;
    callback(null, result);
  });
}

describe('Cairo/vega converter worker', function() {

  it('should get a SVG from a JSON vega-lite file', function(callback) {
    var options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'image/svg+xml'
      },
      body: fs.readFileSync(__dirname + '/resources/bar_chart_lite.json')
    };

    documentAPI(options, function(err, result) {
      should.not.exist(err);
      var svg = result.toString();
      svg.should.match(/Field A/);
      svg.should.match(/Field B/);
      callback();
    });
  });

  it('should return a 400 error for bad vega-lite input', function(callback) {
    var options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'image/svg+xml'
      },
      body: new Buffer('{"test": "ko"}')
    };

    documentAPI(options, function(err) {
      should.exist(err);
      err.code.should.equal(400);
      callback();
    });
  });

  it('should get a SVG from a JSON full vega file', function(callback) {
    var options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'image/svg+xml'
      },
      body: fs.readFileSync(__dirname + '/resources/bar_chart_full.json'),
      qs: {
        chartlib: 'vega'
      }
    };

    documentAPI(options, function(err, result) {
      should.not.exist(err);
      var svg = result.toString();
      svg.should.match(/Field A/);
      svg.should.match(/Field B/);
      callback();
    });
  });

  // No schema validation for now. It seems that some valid vega inputs are rejected.
  // Bad schema, ajv problem ?
  it.skip('should return a 400 error for bad vega input', function(callback) {
    var options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'image/svg+xml'
      },
      body: new Buffer('{"padding": true}'),
      qs: {
        chartlib: 'vega'
      }
    };

    documentAPI(options, function(err) {
      should.exist(err);
      err.code.should.equal(400);
      callback();
    });
  });

  it('should get a PNG from a JSON vega-lite file', function(callback) {
    var options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'image/png'
      },
      body: fs.readFileSync(__dirname + '/resources/bar_chart_lite.json')
    };

    documentAPI(options, function(err) {
      should.not.exist(err);
      callback();
    });
  });

  it('should get a JPEG from a JSON vega-lite file', function(callback) {
    var options = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'image/jpeg'
      },
      body: fs.readFileSync(__dirname + '/resources/bar_chart_lite.json')
    };

    documentAPI(options, function(err) {
      should.not.exist(err);
      callback();
    });
  });

});
