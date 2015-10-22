"use strict";

var cache = {
};

function cacheGet (token, callback) {
  setTimeout(function () {
    console.log("## cache-get: " + cache[token]);
    callback(null, cache[token]);
  }, 0);
}

function cacheSet(token, user, id) {
  console.log("## cache-set: " + user + ", " + id);
  cache[token] = {'user': user, 'id': id};
}

export {
  cacheGet, cacheSet
};
