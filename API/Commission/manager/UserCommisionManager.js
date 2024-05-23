/**
 * Created by A on 7/18/17.
 */
"use strict";
const UserCommisionAccess = require("../resourceAccess/UserCommisionResourceAccess");
const UserCommisionFunctions = require("../UserCommisionFunctions");

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

      let userCommissionList = await UserCommisionAccess.find(filter, skip, limit, order);
      let userCommissionListCount = await UserCommisionAccess.count(filter, order);
      if (userCommissionList && userCommissionListCount) {
        resolve({data: userCommissionList, total: userCommissionListCount[0].count});
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
async function getChildUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let childUser = UserCommisionFunctions.retriveChildUserAndBetTotal(req.payload.userId);
      if(childUser){
        resolve(childUser);
      }else{
        resolve([]);
      }
      reject("failed");
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
  findById,
  getChildUser
};
