"use strict";

var cache = {
};

function cacheGet (token, callback) {
  setTimeout(function () {
    console.log("## cache-get: " + JSON.stringify(cache[token]));
    callback(null, cache[token]);
  }, 0);
}

function cacheSet(token, data) {
  console.log("## cache-set: " + JSON.stringify(data));
  cache[token] = data;
}

export {
  cacheGet, cacheSet
};
