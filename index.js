var express = require('express');
var http = require('http');
var favicon = require('serve-favicon');
var serveStatic = require('serve-static');
var hbs = require('hbs');
var crypto = require('crypto');

hbs.registerHelper('random', function () {
  return randomURL();
});

var app = express();

var register = {};

app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(serveStatic('public'));

function randomURL() {
  return crypto.createHmac('sha1', 'demo').update(Math.random() + '').digest('hex').substr(0, 6);
}

function random(url) {
  var t = 10 + (Math.random() * 20 | 0);

  var result = {
    url: url || '/',
    length: t,
    timeLeft: t,
  };

  var timer = setInterval(function () {
    result.timeLeft--;

    if (result.timeLeft < 0) {
      result.timeLeft = 0;
      clearTimeout(timer);

      setTimeout(function () {
        register[url] = random(url);
      }, 10000);
    }
  }, 1000);

  return result;
}

app.get('/random', function (req, res) {
  res.redirect('/' + randomURL());
});

app.get('/*', function (req, res) {
  if (!req.xhr && !register[req.url]) {
    register[req.url] = random(req.url);
  }

  if (req.xhr) {
    res.status(200).send(register[req.url]);
  } else {
    res.status(200).render('index', register[req.url]);
  }
});

http.createServer(app).listen(process.env.PORT || 8000);