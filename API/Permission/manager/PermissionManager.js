/**
 * Created by A on 7/18/17.
 */
"use strict";
const PermissionResourceAccess = require("../resourceAccess/PermissionResourceAccess");

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve("success");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      let permissions = await PermissionResourceAccess.find(filter, skip, limit, order);
      let permissionsCount = await PermissionResourceAccess.count(filter, order);
      if (permissions && permissionsCount) {
        resolve({data: permissions, total: permissionsCount[0].count});
      }else{
        resolve({data: [], total: 0 });
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve("success");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};
async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve("success");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

module.exports = {
  insert,
  find,
  updateById,
  findById
};
