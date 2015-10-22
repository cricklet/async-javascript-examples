"use strict";

import promisify from 'es6-promisify';
import co from 'co';
import { redisGet, redisSet } from './redis';
import { postgresGet } from './postgres';

var redisGetAsync = promisify(redisGet);
var postgresGetAsync = promisify(postgresGet);

var getIdAfterMissAsync = co.wrap(function * (token) {
  try {
    var id = yield postgresGetAsync(token);
    redisSet(token, id);
    return id

  } catch (err) {
    redisSet(token, undefined);
    return undefined;
  }
});

var getIdAsync = co.wrap(function * (token) {
  console.log("\nGetting '" + token + "'");

  if (!token) {
    callback(new Error("401: Authentication token is malformed or missing."));
  }

  var id;
  try {
    id = yield redisGetAsync(token);
  } catch (err) {
    id = yield getIdAfterMissAsync(token);
  }

  if (id === undefined) {
    throw new Error("401: Authentication token is incorrect.");
  }

  return id;
});

//////////////////////////////////////////////////////////////////////////////////
// Run the code!

var run = co.wrap(function * (token) {
  try {
    var id = yield getIdAsync(token);
    console.log("# got id: " + id);
  } catch (err) {
    console.log("# error: " + err);
  }
});

co(function * () {
  yield run('real-token');
  yield run('real-token');
  yield run('fake-token');
  yield run('fake-token');
});
