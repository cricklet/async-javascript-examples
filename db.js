"use strict";

var db = {
  'real-token': {'user': 'kenrick', 'id': 'real-id'}
};

function dbGet (token, callback) {
  setTimeout(function () {
    console.log("## db-get: " + JSON.stringify(db[token]));
    callback(null, db[token]);
  }, 0);
}

export {
  dbGet
};
