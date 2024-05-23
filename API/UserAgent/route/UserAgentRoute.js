/**
 * Created by A on 7/18/17.
 */
"use strict";
const moduleName = 'UserAgent';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const SystemStatus = require('../../Maintain/MaintainFunctions').systemStatus;

const insertSchema = {
  lastName: Joi.string(),
  firstName: Joi.string(),
  username: Joi.string().alphanum().min(6).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  phoneNumber: Joi.string().required(),
};

const updateSchema = {
  lastName: Joi.string(),
  firstName: Joi.string(),
  phoneNumber: Joi.string().required(),
  active: Joi.number().min(0).max(1),
  limitWithdrawDaily: Joi.number().min(0).max(1000000000),
  twoFACode: Joi.string(),
  userAgentAvatar: Joi.string().allow(''),
  telegramId: Joi.string(),
}

const filterSchema = {
  active: Joi.number().min(0).max(1),
  username: Joi.string().alphanum(),
  email: Joi.string().email(),
  phoneNumber: Joi.string(),
  //referUserAgent: Joi.string(),
};

module.exports = {
  insert: {
    tags: ["api", `${moduleName}`],
    description: `register ${moduleName}`,
    validate: {
      payload: Joi.object(insertSchema)
    },
    handler: function (req, res) {
      Response(req, res, "insert");
    }
  },
  updateById: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyToken }],
    // auth: {
    //   strategy: 'jwt',
    // },
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
    // pre: [{ method: CommonFunctions.verifyToken }],
    // auth: {
    //   strategy: 'jwt',
    // },
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
    // pre: [{ method: CommonFunctions.verifyToken }],
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
  loginUserAgent: {
    tags: ["api", `${moduleName}`],
    description: `login ${moduleName}`,
    validate: {
      payload: Joi.object({
        username: Joi.string().alphanum().min(6).max(30).required(),
        password: Joi.string().required(),
      })
    },
    handler: function (req, res) {
      if(SystemStatus.all === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "loginUserAgent");
    }
  },
  registerUserAgent: {
    tags: ["api", `${moduleName}`],
    description: `register ${moduleName}`,
    validate: {
      payload: Joi.object({
        ...insertSchema
      })
    },
    handler: function (req, res) {
      if(SystemStatus.signup === false){
        res("maintain").code(500);
        return;
      }
      if(SystemStatus.all === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "registerUserAgent");
    }
  },
  resetPasswordUserAgent: {
    tags: ["api", `${moduleName}`],
    description: `reset password ${moduleName}`,
    validate: {
      payload: Joi.object({
        userAgentname: Joi.string().required(),
      })
    },
    handler: function (req, res) {
      if(SystemStatus.all === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "resetPasswordUserAgent");
    }
  },
  changePasswordUserAgent: {
    tags: ["api", `${moduleName}`],
    description: `change password ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyToken }],
    // auth: {
    //   strategy: 'jwt',
    // },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        userAgentname: Joi.string().required(),
        password: Joi.string().required(),
        newPassword: Joi.string().required(),
      })
    },
    handler: function (req, res) {
      Response(req, res, "changePasswordUserAgent");
    }
  },
};
