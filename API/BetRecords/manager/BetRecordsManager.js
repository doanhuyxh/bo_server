/**
 * Created by A on 7/18/17.
 */
"use strict";
const BetRecordsResourceAccess = require("../resourceAccess/BetRecordsResourceAccess");
const UserBetRecordsView = require("../resourceAccess/UserBetRecordsView");
const BetRecordsFunction = require('../BetRecordsFunctions');
const MQTTFunction = require('../../../ThirdParty/MQTTBroker/MQTTBroker');
const BetRecordsAutobot = require('../cronjob/BetRecordsBotJob');
const BetRecodsModel = require('../model/BetRecordsModel');

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    
    try {
      let userId = req.payload.userId;
      let betRecordAmountIn = req.payload.betRecordAmountIn;
      let betRecordType = req.payload.betRecordType;
      let betRecordUnit = req.payload.betRecordUnit;
      let profit = req.payload.profit;
      let result = await BetRecordsFunction.placeUserBet(userId, betRecordAmountIn, betRecordType, betRecordUnit); 
      if (result) {
        let currentTime = new Date();
        result = {
          createdAt: new Date().toISOString(),
          betRecordAmountIn: betRecordAmountIn,
          betRecordType: betRecordType,
          betRecordUnit: betRecordUnit,
          ID: result[0],
          currentSection: currentTime.getHours() + ":" + ((currentTime.getMinutes() * 1) + ":00"),
        };
        resolve(result);
        MQTTFunction.publishJson("LIVE_RECORD", result);
      } else {
        reject("failed");
      }
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

      // if (req.currentUser.userAgentId) {
      //   filter.referId = req.currentUser.userAgentId;
      // }

      let betRecordList = await UserBetRecordsView.customSearch(filter, skip, limit, order);

      let betRecordCount = await UserBetRecordsView.customCount(filter, order);
      let betRecordSum = await UserBetRecordsView.sum('betRecordAmountIn', filter, order);

      if (betRecordList && betRecordCount) {
        for (let i = 0; i < betRecordList.length; i++) {
          betRecordList[i] = BetRecodsModel.fromData(betRecordList[i]);
        }
        resolve({ data: betRecordList, total: betRecordCount[0].count, totalSum: betRecordSum[0].sumResult });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function staffFind(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      // if (req.currentUser.userAgentId) {
      //   filter.referId = req.currentUser.userAgentId;
      // }

      let betRecordList = await UserBetRecordsView.find(filter, skip, limit, order);

      let betRecordCount = await UserBetRecordsView.count(filter, order);
      let betRecordSum = await UserBetRecordsView.sum('betRecordAmountIn', filter, order);
      if (betRecordList && betRecordCount) {
        for (let i = 0; i < betRecordList.length; i++) {
          betRecordList[i] = BetRecodsModel.fromData(betRecordList[i]);
        }
        resolve({ data: betRecordList, total: betRecordCount[0].count, totalSum: betRecordSum[0].sumResult });
      } else {
        resolve({ data: [], total: 0 });
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function findLive(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let limit = req.payload.limit;

      let betRecordList = await UserBetRecordsView.find(filter, 0, limit);
      let betRecordCount = betRecordList.length;
      if (betRecordList && betRecordCount) {
        for (let i = 0; i < betRecordList.length; i++) {
          betRecordList[i] = BetRecodsModel.fromData(betRecordList[i]);
        }
        resolve({ data: betRecordList, total: betRecordCount });
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
      let updateResult = await BetRecordsResourceAccess.updateById(req.payload.id, req.payload.data);
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
      let betRecordList = await UserBetRecordsView.find({ betRecordId: req.payload.id });
      if (betRecordList) {
        for (let i = 0; i < betRecordList.length; i++) {
          betRecordList[i] = BetRecodsModel.fromData(betRecordList[i]);
        }
        resolve(betRecordList[0]);
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

async function summaryUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let filter = req.payload.filter;
      filter.userId = req.currentUser.userId;

      let result = await BetRecordsResourceAccess.sumaryPointAmount(startDate, endDate, filter);
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

      let result = await BetRecordsResourceAccess.sumaryPointAmount(startDate, endDate, filter);
      if (result) {
        resolve(result[0]);
      } else {
        reject("failed");
      }
    } catch (e) {
      console.error("err", e);
      reject("failed");
    }
  });
};

module.exports = {
  insert,
  find,
  updateById,
  findById,
  summaryAll,
  summaryUser,
  findLive,
  staffFind
};
