"use strict";

import { redisGet, redisSet } from './redis';
import { postgresGet } from './postgres';

function getId (token, callback) {
  console.log("\nGetting '" + token + "'");

  redisGet(token, function (err, id) {
    if (err) {
      postgresGet(token, function (err, id) {
	if (err) {
	  redisSet(token, undefined);
	  callback(new Error("401: Authentication token is incorrect."));
	} else {
	  redisSet(token, id);
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


