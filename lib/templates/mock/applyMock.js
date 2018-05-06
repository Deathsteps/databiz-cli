/**
 * @see https://github.com/sorrycc/roadhog/blob/master/src/utils/mock.js
 * See [roadhog](https://github.com/sorrycc/roadhog) for more details.
 * I just remove a few useful functions.
 */

var existsSync = require('fs').existsSync;
var assert = require('assert');
var proxy = require('express-http-proxy');
var url = require('url');
var join = require('path').join;
var bodyParser = require('body-parser');

function getConfig() {
  var configFile = './config';
  if (existsSync(configFile)) {
    // disable require cache
    Object.keys(require.cache).forEach(file => {
      if (file === configFile) {
        delete require.cache[file];
      }
    });
    return require(configFile);
  } else {
    return {};
  }
}

function parseKey(key) {
  let method = 'get';
  let path = key;

  if (key.indexOf(' ') > -1) {
    const splited = key.split(' ');
    method = splited[0].toLowerCase();
    path = splited[1];
  }

  return { method, path };
}

function winPath(path) {
  return path.replace(/\\/g, '/');
}

function createProxy(method, path, target) {
  return proxy(target, {
    filter(req) {
      return method ? req.method.toLowerCase() === method.toLowerCase() : true;
    },
    forwardPath(req) {
      let matchPath = req.originalUrl;
      const matches = matchPath.match(path);
      if (matches.length > 1) {
        matchPath = matches[1];
      }
      return winPath(join(url.parse(target).path, matchPath));
    },
  });
}

function createMockHandler(method, path, value) {
  return function mockHandler(...args) {
    const res = args[1];
    if (typeof value === 'function') {
      value(...args);
    } else {
      res.json(value);
    }
  };
}

module.exports = function applyMock(devServer) {
  const config = getConfig();

  const { app } = devServer;
  devServer.use(bodyParser.json({ limit: '5mb', strict: false }));
  devServer.use(bodyParser.urlencoded({ extended: true, limit: '5mb', }));

  Object.keys(config).forEach(key => {
    const keyParsed = parseKey(key);
    assert(!!app[keyParsed.method], `method of ${key} is not valid`);
    assert(
      typeof config[key] === 'function' ||
        typeof config[key] === 'object' ||
        typeof config[key] === 'string',
      `mock value of ${key} should be function or object or string, but got ${typeof config[
        key
      ]}`,
    );
    if (typeof config[key] === 'string') {
      let { path } = keyParsed;
      if (/\(.+\)/.test(path)) {
        path = new RegExp(`^${path}$`);
      }
      app.use(path, createProxy(keyParsed.method, path, config[key]));
    } else {
      app[keyParsed.method](
        keyParsed.path,
        createMockHandler(keyParsed.method, keyParsed.path, config[key]),
      );
    }
  });
}
