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
      console.log("## got id with postgres");
      redisSet(token, id);
      return id;
    },
    function (err) {
      console.log("## failed to get id with postgres");
      redisSet(token, undefined);
      throw new Error("401: Authentication token is incorrect.");
    }
  );
}

function getIdFromRedisPromise(token) {
  var idPromise = redisGetPromise(token);
  
  return idPromise.then(
    function (id) {
      if (id === undefined) {
	console.log("## got undefined id with redis");
	throw new Error("401: Authentication token is incorrect.");
      }
      
      console.log("## got id with redis");
      return id;
    },
    function (err) {
      console.log("## failed to get id with redis");
      return getIdFromPostgresPromise(token);
    }
  );
}

function getIdPromise(token) {
  console.log("\nGetting '" + token + "'");

  if (!token) {
    callback(new Error("401: Authentication token is malformed or missing."));
  }

  return getIdFromRedisPromise(token);
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
