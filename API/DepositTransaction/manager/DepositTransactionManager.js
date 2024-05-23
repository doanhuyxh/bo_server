/**
 * Created by A on 7/18/17.
 */
"use strict";
const DepositTransactionAccess = require("../resourceAccess/DepositTransactionResourceAccess");
const UserDepositTransactionView = require("../resourceAccess/UserDepositTransactionView");
const DepositTransactionUserView = require("../resourceAccess/DepositTransactionUserView");
const UserResource = require("../../User/resourceAccess/UserResourceAccess");
const DepositFunction = require('../DepositTransactionFunctions');
const { DEPOSIT_TRX_STATUS } = require('../DepositTransactionConstant');
const token = require('../../../utils/token');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {

      let userId = req.payload.userId;
      

      let pointAmount = req.payload.pointAmount;
      let hinhxacnhan = req.payload.hinhxacnhan;
      if (hinhxacnhan === undefined) {
        hinhxacnhan = "";
      }
      if (!userId) {
        reject("user is invalid");
        return;
      }

      // if (req.currentUser.userId && req.currentUser.userId !== userId) {
      //   reject("unauthorize deposit");
      //   return;
      // }

      let user = await UserResource.find({ userId: userId });
      if (!user || user.length < 1) {
        reject("can not find user");
        return;
      }
      user = user[0];

      // if (user.sotaikhoan === "" || user.tentaikhoan === "" || user.tennganhang === "") {
      //   reject("user did not update sotaikhoan");
      //   return;
      // }

      let result = await DepositFunction.createDepositTransaction(user, pointAmount, DEPOSIT_TRX_STATUS.NEW, hinhxacnhan);
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

async function addUserPointByStaff(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userId = req.payload.userId;
      let pointAmount = req.payload.pointAmount;
      if (!userId) {
        reject("user is invalid");
      }

      if (req.currentUser.userId && req.currentUser.userId !== userId) {
        reject("unauthorize deposit");
        return;
      }

      let user = await UserResource.find({ userId: userId });
      if (!user || user.length < 1) {
        reject("can not find user");
      }
      user = user[0];

      //auto complete deposit transaction
      let result = await DepositFunction.createDepositTransaction(user, pointAmount, DEPOSIT_TRX_STATUS.NEW);
      if (result) {
        let approveResult = await DepositFunction.approveDepositTransaction(result[0]);
        if (!approveResult) {
          console.error("deposit transaction was not approve");
        }
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

      if (req.currentUser.userAgentId) {
        filter.referId = req.currentUser.userAgentId;
        filter.status = DEPOSIT_TRX_STATUS.COMPLETED;
      }

      let transactionList = await DepositTransactionUserView.customSearch(filter, skip, limit, order);
      let transactionCount = await DepositTransactionUserView.customCount(filter, order);

      // let transactionSumBIT = await UserDepositTransactionView.sum('pointAmount', {
      //   ...filter,
      //   walletType: "Game"
      // }, order);

      if (transactionList && transactionCount && transactionList.length > 0) {
        resolve({
          data: transactionList,
          total: transactionCount[0].count,
          // totalDeposit: transactionSumBIT.length > 0 ? transactionSumBIT[0].sumResult : 0,
        });
      } else {
        resolve({
          data: [],
          total: 0,
          // totalDeposit: 0,
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
      let updateResult = await DepositTransactionAccess.updateById(req.payload.id, req.payload.data);
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
      let transactionList = await DepositTransactionUserView.find({ depositTransactionId: req.payload.id });
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

async function findByUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      console.log("filter",req, filter)

      let transactionList = await DepositTransactionUserView.find(filter, skip, limit, order);
      let transactionCount = await DepositTransactionUserView.count(filter, order);

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

async function denyDepositTransaction(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      let updateResult = await DepositTransactionAccess.updateById(req.payload.id, {
        status: DEPOSIT_TRX_STATUS.CANCELED,
        note: `Admin từ chối nạp tiền ${new Date().toISOString()}`
      });
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
}

async function approveDepositTransaction(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      let approveResult = await DepositFunction.approveDepositTransaction(req.payload.id);
      if (approveResult) {
        resolve("success");
      } else {
        console.error("deposit transaction was not approve");
        reject("failed");
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
}

async function summaryUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let filter = req.payload.filter;
      filter.userId = req.currentUser.userId;

      let result = await DepositTransactionAccess.sumaryPointAmount(startDate, endDate, filter);
      if (result) {
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

async function summaryAll(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let filter = req.payload.filter;

      let result = await DepositTransactionAccess.sumaryPointAmount(startDate, endDate, filter);
      if (result) {
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

module.exports = {
  insert,
  find,
  updateById,
  findById,
  addUserPointByStaff,
  approveDepositTransaction,
  summaryAll,
  summaryUser,
  denyDepositTransaction,
  findByUser
};
