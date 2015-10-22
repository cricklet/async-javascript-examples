"use strict";

var cache = {
};

function cacheGet (token, callback) {
  if (token in cache) {
    setTimeout(function () {
      console.log("## cache-get: success (" + cache[token] + ")");
      callback(null, cache[token]);
    }, 0);
  } else {
    setTimeout(function () {
      console.log("## cache-get: failed");
      callback(new Error("Couldn't find token in cache."));
    }, 0);
  }
}
function cacheSet(token, id) {
  console.log("## cache-set: " + id);
  cache[token] = id;
}

export {
  cacheGet, cacheSet
};
