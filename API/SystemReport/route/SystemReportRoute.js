/**
 * Created by A on 7/18/17.
 */
"use strict";
const moduleName = 'SystemReport';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

const filterSchema = {
  userId: Joi.number(),
  referId: Joi.number(),
  betRecordType: Joi.string(),
  betRecordStatus: Joi.string(),
  betRecordSection: Joi.string(),
  betRecordResult: Joi.string(),
};

module.exports = {
  summaryReport: {
    tags: ["api", `${moduleName}`],
    description: `insert ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, {method: CommonFunctions.verifyAgentOrStaffToken}],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        startDate: Joi.string(),
        endDate: Joi.string(),
        referAgentId: Joi.number()
      })
    },
    handler: function (req, res) {
      Response(req, res, "summaryReport");
    }
  },
};
