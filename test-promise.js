"use strict";

import promisify from 'es6-promisify';
import { cacheGet, cacheSet } from './cache';
import { dbGet } from './db';

var cacheGetPromise = promisify(cacheGet);
var dbGetPromise = promisify(dbGet);

function getIdFromDBPromise(token) {
  var idPromise = dbGetPromise(token);

  return idPromise.then(
    function (id) {
      cacheSet(token, id);
      return id;
    },
    function (err) {
      cacheSet(token, undefined);
      return undefined;
    }
  );
}

function getIdFromCachePromise(token) {
  var idPromise = cacheGetPromise(token);

  return idPromise.then(
    function (id) {
      return id;
    },
    function (err) {
      return getIdFromDBPromise(token);
    }
  );
}

function getIdPromise(token) {
  console.log("\nGetting '" + token + "'");

  return getIdFromCachePromise(token)
    .then(function (id) {
      if (id === undefined) {
	throw new Error("401: Authentication token is incorrect.");
      }
      return id;
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
