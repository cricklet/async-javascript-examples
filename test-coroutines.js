"use strict";

import promisify from 'es6-promisify';
import co from 'co';
import { cacheGet, cacheSet } from './cache';
import { dbGet } from './db';

var cacheGetAsync = promisify(cacheGet);
var dbGetAsync = promisify(dbGet);

var getDataAsync = co.wrap(function * (token) {
  var data = yield cacheGetAsync(token);
  if (data) {
    return data;
  }

  data = yield dbGetAsync(token);
  cacheSet(token, data);

  return data;
});

var getIdAsync = co.wrap(function * (token) {
  console.log("\nGetting '" + token + "'");

  var data = yield getDataAsync(token);
  if (!data || data.id == undefined) {
    throw new Error("401: Authentication token is incorrect.");
  }
  return data.id;
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
