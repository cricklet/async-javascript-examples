"use strict";

var redis = {
};

function redisGet (token, callback) {
  if (token in redis) {
    setTimeout(function () {
      console.log("## redis-get: success (" + redis[token] + ")");
      callback(null, redis[token]);
    }, 0);
  } else {
    setTimeout(function () {
      console.log("## redis-get: failed");
      callback(new Error("Couldn't find token in redis."));
    }, 0);
  }
}
function redisSet(token, id) {
  console.log("## redis-set: " + id);
  redis[token] = id;
}

export {
  redisGet, redisSet
};
