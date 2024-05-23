/**
 * Created by A on 7/18/17.
 */
"use strict";
const TransactionPolicyResourceAccess = require("../resourceAccess/TransactionPolicyResourceAccess");

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let transactionData = req.payload;
      await TransactionPolicyResourceAccess.insert(transactionData);
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

      let transactionList = await TransactionPolicyResourceAccess.find(filter, skip, limit, order);
      let transactionCount = await TransactionPolicyResourceAccess.count(filter, order);
      
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
      let updateResult = await TransactionPolicyResourceAccess.updateById(req.payload.id, req.payload.data);
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
      let transactionList = await TransactionPolicyResourceAccess.find({ transactionPolicyId: req.payload.id });
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
