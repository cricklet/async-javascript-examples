"use strict";

import promisify from 'es6-promisify';
import co from 'co';
import { redisGet, redisSet } from './redis';
import { postgresGet } from './postgres';

var redisGetAsync = promisify(redisGet);
var postgresGetAsync = promisify(postgresGet);

var getIdFromRedisAsync = co.wrap(function * (token) {
});

var _getIdAsyncMiss = co.wrap(function * (token) {
  var id;
  try {
    id = yield postgresGetAsync(token);
  } catch (err) {
  } finally {
    redisSet(token, id);
  }

  return id;
});

var getIdAsync = co.wrap(function * (token) {
  console.log("\nGetting '" + token + "'");

  if (!token) {
    callback(new Error("401: Authentication token is malformed or missing."));
  }

  var id;

  try {
    id = yield redisGetAsync(token);
    console.log("## got id with redis: " + id);

  } catch (err) {
    console.log("## failed to get id with redis: " + id);
    id = yield _getIdAsyncMiss(token);
    console.log("## got id with postgres: " + id);
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
