function request(type, url, opts, callback) {
  var xhr = new XMLHttpRequest(),
      fd;

  if (typeof opts === 'function') {
    callback = opts;
    opts = null;
  }

  xhr.open(type, url);

  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  if (type === 'POST' && opts) {
    fd = new FormData();

    for (var key in opts) {
      fd.append(key, JSON.stringify(opts[key]));
    }
  }

  xhr.onload = function () {
    callback(JSON.parse(xhr.response));
  };

  xhr.send(opts ? fd : null);
}

var get = request.bind(this, 'GET');
var post = request.bind(this, 'POST');

var text = document.querySelector('#timeLeftText');
var input = document.querySelector('#timeLeft');

var timer = setInterval(function () {
  get(window.location, function (data) {
    text.innerHTML = data.timeLeft;
    input.value = data.timeLeft;

    if (data.timeLeft === 0) {
      window.location.reload();
      clearInterval(timer);
    }
  });
}, 500)

