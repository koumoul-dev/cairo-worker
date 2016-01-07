var fs = require('fs');
var apiBenchmark = require('api-benchmark');

var services = {
  server1: 'http://localhost:3121'
};

var routes = {
  svg: {
    method: 'get',
    route: 'document',
    expectedStatusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'image/svg+xml'
    },
    data: fs.readFileSync(__dirname + '/resources/bar_chart_lite.json', 'utf8')
  },
  png: {
    method: 'get',
    route: 'document',
    expectedStatusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'image/png'
    },
    data: fs.readFileSync(__dirname + '/resources/bar_chart_lite.json', 'utf8')
  },
  jpeg: {
    method: 'get',
    route: 'document',
    expectedStatusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'image/jpeg'
    },
    data: fs.readFileSync(__dirname + '/resources/bar_chart_lite.json', 'utf8')
  }
};

apiBenchmark.measure(services, routes, {
  runMode: 'parallel',
  maxConcurrentRequests: 100
}, function(err, results) {
  if (err) throw err;
  apiBenchmark.getHtml(results, function(err, html) {
    if (err) throw err;
    console.log('Write results in benchmark-results/report.html');
    fs.writeFileSync('./benchmark-results/report.html', html);
  });
});
