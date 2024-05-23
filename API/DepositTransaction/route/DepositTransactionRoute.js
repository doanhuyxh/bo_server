/**
 * Created by A on 7/18/17.
 */
"use strict";
const moduleName = 'DepositTransaction';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const { DEPOSIT_TRX_STATUS } = require("../DepositTransactionConstant");

const insertSchema = {
  userId: Joi.number().required(),
  pointAmount: Joi.number().required().default(1000000),
  hinhxacnhan: Joi.string().allow('').default(''),
};

const updateSchema = {
  ...insertSchema,
  status: Joi.string(),
}

const filterSchema = {
  userId: Joi.number(),
  userName: Joi.string(),
  walletAddress: Joi.string(),
  walletType: Joi.string(),
  createdAt: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string(),
  memberLevelName: Joi.string(),
  active: Joi.number(),
  ipAddress: Joi.string(),
  phoneNumber: Joi.string(),
  zaloId: Joi.string(),
  referId: Joi.string(),
  sotaikhoan: Joi.string(),
  status: Joi.string(),
};

module.exports = {
  insert: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyToken }],
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
  addUserPointByStaff: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken },{ method: CommonFunctions.verifyStaffToken } ],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object(insertSchema)
    },
    handler: function (req, res) {
      Response(req, res, "addUserPointByStaff");
    }
  },
  updateById: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken },{ method: CommonFunctions.verifyStaffToken } ],
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
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAgentOrStaffToken }],
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
    pre: [{ method: CommonFunctions.verifyToken }],
    auth: {
      strategy: 'jwt',
    },
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
  findByUser: {
    tags: ["api", `${moduleName}`],
    description: `find by id ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyToken }],
    // auth: {
    //   strategy: 'jwt',
    // },
    validate: {
      // headers: Joi.object({
      //   authorization: Joi.string(),
      // }).unknown(),
      payload: Joi.object({
        filter: Joi.object({
          status: Joi.string().default(DEPOSIT_TRX_STATUS.NEW).allow([DEPOSIT_TRX_STATUS.NEW, DEPOSIT_TRX_STATUS.COMPLETED, DEPOSIT_TRX_STATUS.CANCELED]),
          userId: Joi.number()
        }),
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
      Response(req, res, "findByUser");
    }
  },
  approveDepositTransaction: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken },{ method: CommonFunctions.verifyStaffToken } ],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      })
    },
    handler: function (req, res) {
      Response(req, res, "approveDepositTransaction");
    }
  },
  denyDepositTransaction: {
    tags: ["api", `${moduleName}`],
    description: `deny ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken },{ method: CommonFunctions.verifyStaffToken } ],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        id: Joi.number().min(0),
      })
    },
    handler: function (req, res) {
      Response(req, res, "denyDepositTransaction");
    }
  },
  summaryUser: {
    tags: ["api", `${moduleName}`],
    description: `summaryUser ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAgentOrStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        startDate: Joi.string().default(new Date().toISOString()),
        endDate: Joi.string().default(new Date().toISOString()),
      })
    },
    handler: function (req, res) {
      Response(req, res, "summaryUser");
    }
  },
  summaryAll: {
    tags: ["api", `${moduleName}`],
    description: `summaryAll ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyAgentOrStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        filter: Joi.object(filterSchema),
        startDate: Joi.string().default(new Date().toISOString()),
        endDate: Joi.string().default(new Date().toISOString()),
      })
    },
    handler: function (req, res) {
      Response(req, res, "summaryAll");
    }
  },
};
