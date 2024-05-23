/**
 * Created by A on 7/18/17.
 */
"use strict";
const moduleName = 'User';
const Manager = require(`../manager/${moduleName}Manager`);
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');
const Userfunctions = require('../UserFunctions');
const SystemStatus = require('../../Maintain/MaintainFunctions').systemStatus;

const insertSchema = {
  lastName: Joi.string(),
  firstName: Joi.string(),
  username: Joi.string().alphanum().min(6).max(30).required(),
  email: Joi.string().email().allow(''),
  referUser: Joi.string(),
  password: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  zaloId: Joi.string()
};

const updateSchema = {
  lastName: Joi.string(),
  firstName: Joi.string(),
  phoneNumber: Joi.string(),
  active: Joi.number().min(0).max(1),
  limitWithdrawDaily: Joi.number().min(0).max(1000000000),
  twoFACode: Joi.string(),
  userAvatar: Joi.string().allow(''),
  zaloId: Joi.string(),
  socmnd: Joi.string().allow(''),
  cmndtruoc: Joi.string().allow(''),
  cmndsau: Joi.string().allow(''),
  cmndnguoi: Joi.string().allow(''),
  sotaikhoan: Joi.string().allow(''),
  tentaikhoan: Joi.string().allow(''), 
  tennganhang: Joi.string().allow(''),
  note: Joi.string().allow('')
}

const filterSchema = {
  active: Joi.number().min(0).max(1),
  username: Joi.string().alphanum(),
  email: Joi.string().email(),
  phoneNumber: Joi.string(),
  referUser: Joi.string(),
};

module.exports = {
  insert: {
    tags: ["api", `${moduleName}`],
    description: `register ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    // validate: {
    //   payload: Joi.object(insertSchema)
    // },
    handler: function (req, res) {
      Response(req, res, "insert");
    }
  },
  updateById: {
    tags: ["api", `${moduleName}`],
    description: `update ${moduleName}`,
    // pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyOwnerToken }],
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
    // pre: [{ method: CommonFunctions.verifyToken }, {method: CommonFunctions.verifyAgentOrStaffToken }],
    // auth: {
    //   strategy: 'jwt',
    // },
    validate: {
      // headers: Joi.object({
      //   authorization: Joi.string(),
      // }).unknown(),
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
  loginUser: {
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
      Response(req, res, "loginUser");
    }
  },
  registerUser: {
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
      Response(req, res, "registerUser");
    }
  },
  resetPasswordUser: {
    tags: ["api", `${moduleName}`],
    description: `reset password ${moduleName}`,
    validate: {
      payload: Joi.object({
        username: Joi.string().required(),
      })
    },
    handler: function (req, res) {
      if(SystemStatus.all === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "resetPasswordUser");
    }
  },
  changePasswordUser: {
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
        username: Joi.string().required(),
        password: Joi.string().required(),
        newPassword: Joi.string().required(),
      })
    },
    handler: function (req, res) {
      Response(req, res, "changePasswordUser");
    }
  },
  staffChangePasswordUser: {
    tags: ["api", `${moduleName}`],
    description: `change password ${moduleName}`,
    pre: [{ method: CommonFunctions.verifyToken }, { method: CommonFunctions.verifyStaffToken }],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        username: Joi.string().required(),
        newPassword: Joi.string().required(),
      })
    },
    handler: function (req, res) {
      Response(req, res, "staffChangePasswordUser");
    }
  },
  staffEditUser: {
    tags: ["api", `${moduleName}`],
    description: `staff edit ${moduleName}`,
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
      Response(req, res, "staffEditUser");
    }
  },
  verify2FA: {
    tags: ["api", `${moduleName}`],
    description: `change password ${moduleName}`,
    validate: {
      payload: Joi.object({
        otpCode: Joi.string().required(),
        id: Joi.number().required()
      })
    },
    handler: function (req, res) {
      if(SystemStatus.all === false){
        res("maintain").code(500);
        return;
      }
      Response(req, res, "verify2FA");
    }
  },
  get2FACode: {
    tags: ["api", `${moduleName}`],
    description: `get QrCode for 2FA ${moduleName}`,
    handler: function (req, res) {
      if(req.query.userId){
        Userfunctions.generate2FACode(req.query.userId).then((qrCode) => {
          console.log(qrCode);
          if(qrCode){
            res.file(qrCode);
          }else{
            res("error").code(500);
          }
        });
      }else{
        res("error").code(500);
      }
    }
  },
};
