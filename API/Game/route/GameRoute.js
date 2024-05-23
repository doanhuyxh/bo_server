/**
 * Created by A on 7/18/17.
 */
"use strict";
const moduleName = 'Game';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const SystemStatus = require('../../Maintain/MaintainFunctions').systemStatus;
const { BET_UNIT } = require('../../BetRecords/BetRecordsConstant');
const { GAME_RECORD_STATUS } = require('../GameRecordsConstant');

const insertSchema = {
  // gameRecordPrice: Joi.string().required(),
  gameRecordTypeUp: Joi.number().min(0).max(1).default(0).required(),
  gameRecordTypeDown: Joi.number().min(0).max(1).default(0).required(),
  gameRecordTypeOdd: Joi.number().min(0).max(1).default(0).required(),
  gameRecordTypeEven: Joi.number().min(0).max(1).default(0).required(),
  gameRecordUnit: Joi.string().allow([BET_UNIT.BTC, BET_UNIT.ETH]).required(),
  gameRecordSection: Joi.string().required(),
  // gameRecordNote: Joi.string(),
  //gameRecordStatus: Joi.string().default(GAME_RECORD_STATUS.NEW).required(),
};

const updateSchema = {
  gameRecordPrice: Joi.string(),
  gameRecordTypeUp: Joi.number().min(0).max(1),
  gameRecordTypeDown: Joi.number().min(0).max(1),
  gameRecordTypeOdd: Joi.number().min(0).max(1),
  gameRecordTypeEven: Joi.number().min(0).max(1),
  gameRecordUnit: Joi.string().allow([BET_UNIT.BTC, BET_UNIT.ETH]),
  gameRecordSection: Joi.string(),
  gameRecordNote: Joi.string(),
  gameRecordStatus: Joi.string(),
};

const filterSchema = {
  gameRecordPrice: Joi.string(),
  gameRecordTypeUp: Joi.number().min(0).max(1),
  gameRecordTypeDown: Joi.number().min(0).max(1),
  gameRecordTypeOdd: Joi.number().min(0).max(1),
  gameRecordTypeEven: Joi.number().min(0).max(1),
  gameRecordUnit: Joi.string().allow([BET_UNIT.BTC, BET_UNIT.ETH]),
  gameRecordSection: Joi.string(),
  gameRecordNote: Joi.string(),
  gameRecordStatus: Joi.string(),
};

module.exports = {
  gameRecordList: {
    tags: ["api", `${moduleName}`],
    description: `gameRecordList ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        gameRecordUnit: Joi.string().allow([BET_UNIT.BTC, BET_UNIT.ETH]).default(BET_UNIT.BTC).required(),
      })
    },
    handler: function (req, res) {
      if(SystemStatus.liveGame === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "gameRecordList");
    }
  },
  gameChartRecordList: {
    tags: ["api", `${moduleName}`],
    description: `gameRecordList ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyToken }],
    // auth: {
    //   strategy: 'jwt',
    // },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        cryptoCurrency: Joi.string().allow(["ETH","BTC"]).default("BTC").required(),
      })
    },
    handler: function (req, res) {
      if(SystemStatus.liveGame === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "gameChartRecordList");
    }
  },
  gameSectionList: {
    tags: ["api", `${moduleName}`],
    description: `gameSectionList ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({

      })
    },
    handler: function (req, res) {
      if(SystemStatus.liveGame === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "gameSectionList");
    }
  },
  insert: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    // auth: {
    //   strategy: 'jwt',
    // },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object(insertSchema)
    },
    handler: function (req, res) {
      Response(req, res, "insert");
    }
  },
  updateById: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
        data: Joi.object(updateSchema),
      })
    },
    handler: function (req, res) {
      Response(req, res, "updateById");
    }
  },
  find: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        skip: Joi.number().default(0).min(0),
        limit: Joi.number().default(20).max(100),
        order: Joi.object({
          key: Joi.string()
            .default("createdAt")
            .allow(""),
          value: Joi.string()
            .default("desc")
            .allow("")
        })
      })
    },
    handler: function (req, res) {
      Response(req, res, "find");
    }
  },
  findById: {
    tags: ["api", `${moduleName}`],
    description: `find by id ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    // auth: {
    //   strategy: 'jwt',
    // },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0)
      })
    },
    handler: function (req, res) {
      Response(req, res, "findById");
    }
  },
  insertMany: {
    tags: ["api", `${moduleName}`],
    description: `insertMany ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        gameRecordUnit: Joi.string().allow([BET_UNIT.BTC, BET_UNIT.ETH]).required(),
        gameRecordSection: Joi.string().required(),
        gameRecordCount: Joi.number().min(10).max(50),
      })
    },
    handler: function (req, res) {
      Response(req, res, "insertMany");
    }
  },
};
