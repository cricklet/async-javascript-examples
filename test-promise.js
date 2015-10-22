"use strict";

import promisify from 'es6-promisify';
import { redisGet, redisSet } from './redis';
import { postgresGet } from './postgres';

var redisGetPromise = promisify(redisGet);
var postgresGetPromise = promisify(postgresGet);

function getIdFromPostgresPromise(token) {
  var idPromise = postgresGetPromise(token);

  return idPromise.then(
    function (id) {
      redisSet(token, id);
      return id;
    },
    function (err) {
      redisSet(token, undefined);
      return undefined;
    }
  );
}

function getIdFromRedisPromise(token) {
  var idPromise = redisGetPromise(token);
  
  return idPromise.then(
    function (id) {
      return id;
    },
    function (err) {
      return getIdFromPostgresPromise(token);
    }
  );
}

function getIdPromise(token) {
  console.log("\nGetting '" + token + "'");

  return getIdFromRedisPromise(token)
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
