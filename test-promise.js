"use strict";

import promisify from 'es6-promisify';
import { cacheGet, cacheSet } from './cache';
import { dbGet } from './db';

var cacheGetPromise = promisify(cacheGet);
var dbGetPromise = promisify(dbGet);

function getDataFromDBPromise(token) {
  var dataPromise = dbGetPromise(token);

  return dataPromise.then(
    function (data) {
      cacheSet(token, data || {});
      return data;
    }
  );
}

function getDataFromCachePromise(token) {
  var dataPromise = cacheGetPromise(token);

  return dataPromise.then(
    function (data) {
      if (!data) {
        return getDataFromDBPromise(token);
      }
      return data;
    }
  );
}

function getIdPromise(token) {
  console.log("\nGetting '" + token + "'");

  return getDataFromCachePromise(token)
  .then(function (data) {
    if (!data || data.id === undefined) {
      throw new Error("401: Authentication token is incorrect.");
    }
    return data.id;
  });
}

//////////////////////////////////////////////////////////////////////////////////
// Run the code!

function success (id) {
  console.log("# got id: " + id);
}

function error (err) {
  console.log("# error: " + err);
}

getIdPromise('real-token')
.then(success, error)
.then(getIdPromise.bind(null, 'real-token'))
.then(success,error)
.then(getIdPromise.bind(null, 'fake-token'))
.then(success,error)
.then(getIdPromise.bind(null, 'fake-token'))
.then(success,error);
