"use strict";

var db = {
  'real-token': {'user': 'kenrick', 'id': 'real-token'}
};

function dbGet (token, callback) {
  setTimeout(function () {
    console.log("## db-get: " + db[token]);
    callback(null, db[token]);
  }, 0);
}

export {
  dbGet
};
