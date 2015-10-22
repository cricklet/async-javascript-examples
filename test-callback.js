"use strict";

import { cacheGet, cacheSet } from './cache';
import { dbGet } from './db';

function getData(token, callback) {
  cacheGet(token, function (err, data) {
    if (err) {
      callback(err);
      return;
    }

    if (!data) {
      dbGet(token, function (err, data) {
        if (err) {
          callback(err);
          return;
        }
        cacheSet(token, data);
        callback(null, data);
      });
      return;
    }

    callback(null, data);
  });
}

function getId (token, callback) {
  console.log("\nGetting '" + token + "'");
  getData(token, function (err, data) {
    if (!data || data.id == undefined) {
      callback(new Error("401: Authentication token is incorrect."));
      return;
    }

    callback(null, data.id);
  });
}

function log (err, id) {
  if (err) {
    console.log("# error: " + err);
  } else {
    console.log("# got id: " + id);
  }
}

//////////////////////////////////////////////////////////////////////////////////
// Run the code!

getId('real-token', function (err, id) {
  log(err, id);

  getId('real-token', function (err, id) {
    log(err, id);

    getId('fake-token', function (err, id) {
      log(err, id);

      getId('fake-token', function (err, id) {
        log(err, id);
      });
    });
  });
});
