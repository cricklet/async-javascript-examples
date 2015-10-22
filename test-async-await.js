"use strict";

import promisify from 'es6-promisify';
import co from 'co';
import { cacheGet, cacheSet } from './cache';
import { dbGet } from './db';

var cacheGetAsync = promisify(cacheGet);
var dbGetAsync = promisify(dbGet);

async function getDataAsync (token) {
  var data = await cacheGetAsync(token);
  if (data) {
    return data;
  }

  data = await dbGetAsync(token);
  cacheSet(token, data || {});

  return data;
}

async function getIdAsync (token) {
  console.log("\nGetting '" + token + "'");

  var data = await getDataAsync(token);
  if (!data || data.id == undefined) {
    throw new Error("401: Authentication token is incorrect.");
  }
  return data.id;
}

//////////////////////////////////////////////////////////////////////////////////
// Run the code!

async function run (token) {
  try {
    var id = await getIdAsync(token);
    console.log("# got id: " + id);
  } catch (err) {
    console.log("# error: " + err);
  }
}

(async function () {
  await run('real-token');
  await run('real-token');
  await run('fake-token');
  await run('fake-token');
} ());
