/**
 * Created by A on 7/18/17.
 */
"use strict";
const UserPaymentMethodResourceAccess = require("../resourceAccess/UserPaymentMethodResourceAccess");

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userPaymentMethodData = req.payload;
      let result = await UserPaymentMethodResourceAccess.insert(userPaymentMethodData);
      if (result) {
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

      let userPaymentMethods = await UserPaymentMethodResourceAccess.find(filter, skip, limit, order);
      let userPaymentMethodsCount = await UserPaymentMethodResourceAccess.count(filter, order);
      if (userPaymentMethods && userPaymentMethodsCount) {
        resolve({ data: userPaymentMethods, total: userPaymentMethodsCount[0].count });
      } else {
        resolve({ data: [], total: 0 });
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
      let userPaymentMethodId = req.payload.id;
      let userPaymentMethodData = req.payload.data;
      let result = await UserPaymentMethodResourceAccess.updateById(userPaymentMethodId, userPaymentMethodData);
      if (result) {
        resolve(result);
      } else {
        reject("failed");
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
      let userPaymentMethodId = req.payload.id;
      let result = await UserPaymentMethodResourceAccess.find({ userPaymentMethodId: userPaymentMethodId });
      if (result && result.length > 0) {
        resolve(result[0]);
      } else {
        reject("failed");
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};
async function findALL(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await UserPaymentMethodResourceAccess.findALL("userpaymentmethod");
      console.log("result", result)
      resolve(result)
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
  findALL
};
