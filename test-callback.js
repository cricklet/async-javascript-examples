"use strict";

import { cacheGet, cacheSet } from './cache';
import { dbGet } from './db';

function getId (token, callback) {
  console.log("\nGetting '" + token + "'");

  cacheGet(token, function (err, id) {
    if (err) {
      dbGet(token, function (err, id) {
        if (err) {
          cacheSet(token, undefined);
          callback(new Error("401: Authentication token is incorrect."));
        } else {
          cacheSet(token, id);
          callback(null, id);
        }
      });
    } else {
      if (id === undefined) {
        callback(new Error("401: Authentication token is incorrect."));
        return;
      }
      callback(null, id);
    }
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
