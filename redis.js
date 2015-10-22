"use strict";

var redis = {
};

function redisGet (token, callback) {
  if (token in redis) {
    setTimeout(function () {
      callback(null, redis[token]);
    }, 0);
  } else {
    setTimeout(function () {
      callback(new Error("Couldn't find token in redis."));
    }, 0);
  }
}
function redisSet(token, id) {
  redis[token] = id;
}

export {
  redisGet, redisSet
};
