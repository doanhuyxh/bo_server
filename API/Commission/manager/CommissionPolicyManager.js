/**
 * Created by A on 7/18/17.
 */
"use strict";
const CommissionPolicyResourceAccess = require("../resourceAccess/CommissionPolicyResourceAccess");

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let transactionData = req.payload;
      await CommissionPolicyResourceAccess.insert(transactionData);
      reject("done");
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

      let transactionList = await CommissionPolicyResourceAccess.find(filter, skip, limit, order);
      let transactionCount = await CommissionPolicyResourceAccess.count(filter, order);
      
      if (transactionList && transactionCount && transactionList.length > 0) {
        resolve({
          data: transactionList, 
          total: transactionCount[0].count,
        });
      } else {
        resolve({
          data: [], 
          total: 0,
        });
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
      let updateResult = await CommissionPolicyResourceAccess.updateById(req.payload.id, req.payload.data);
      if (updateResult) {
        resolve(updateResult);
      } else {
        resolve({});
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let transactionList = await CommissionPolicyResourceAccess.find({ commissionPolicyId: req.payload.id });
      if (transactionList) {
        resolve(transactionList[0]);
      } else {
        resolve({});
      }
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
