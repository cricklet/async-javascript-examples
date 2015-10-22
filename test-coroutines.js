"use strict";

import promisify from 'es6-promisify';
import co from 'co';
import { cacheGet, cacheSet } from './cache';
import { dbGet } from './db';

var cacheGetAsync = promisify(cacheGet);
var dbGetAsync = promisify(dbGet);

var getIdAsyncMissHelper = co.wrap(function * (token) {
  var id;

  try {
    id = yield dbGetAsync(token);
  } catch (err) {
    id = undefined;
  }

  cacheSet(token, id);
  return id;
});

var getIdAsyncHelper = co.wrap(function * (token) {
  try {
    return yield cacheGetAsync(token);
  } catch (err) {
    return yield getIdAsyncMissHelper(token);
  }
});

var getIdAsync = co.wrap(function * (token) {
  console.log("\nGetting '" + token + "'");

  var id = yield getIdAsyncHelper(token);
  if (id == undefined) {
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
