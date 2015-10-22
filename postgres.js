"use strict";

var postgres = {
  'real-token': 'real-id'
};

function postgresGet (token, callback) {
  if (token in postgres) {
    setTimeout(function () {
      console.log("## postgres-get: success (" + postgres[token] + ")");
      callback(null, postgres[token]);
    }, 0);
  } else {
    setTimeout(function () {
      console.log("## postgres-get: failed");
      callback(new Error("Couldn't find token in postgres."));
    }, 0);
  }
}

export {
  postgresGet
};
