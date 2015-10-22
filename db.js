"use strict";

var db = {
  'real-token': 'real-id'
};

function dbGet (token, callback) {
  if (token in db) {
    setTimeout(function () {
      console.log("## db-get: success (" + db[token] + ")");
      callback(null, db[token]);
    }, 0);
  } else {
    setTimeout(function () {
      console.log("## db-get: failed");
      callback(new Error("Couldn't find token in db."));
    }, 0);
  }
}

export {
  dbGet
};
