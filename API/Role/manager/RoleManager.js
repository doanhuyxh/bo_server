/**
 * Created by A on 7/18/17.
 */
"use strict";
const RoleResourceAccess = require("../resourceAccess/RoleResourceAccess");

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let roleData = req.payload;
      let result = await RoleResourceAccess.insert(roleData);
      if(result){
        resolve(result);
      }
      reject("failed");
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

      let roles = await RoleResourceAccess.find(filter, skip, limit, order);
      let rolesCount = await RoleResourceAccess.count(filter, order);
      if (roles && rolesCount) {
        resolve({data: roles, total: rolesCount[0].count});
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
      let roleId = req.payload.id;
      let roleData = req.payload.data;
      let result = await RoleResourceAccess.updateById(roleId, roleData);
      if(result){
        resolve(result);
      }
      reject("failed");
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
