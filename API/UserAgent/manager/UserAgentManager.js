/**
 * Created by A on 7/18/17.
 */
"use strict";
const UserAgentResourceAccess = require("../resourceAccess/UserAgentResourceAccess");
const TokenFunction = require('../../../utils/token');
const UserAgentFunction = require('../UserAgentFunctions');
async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = req.payload;

      //hash password
      userData.password = UserAgentFunction.hashPassword(userData.password);

      //create new user
      let addResult = await UserAgentResourceAccess.insert(userData);
      if (addResult === undefined) {
        reject("can not insert user");
        return;
      } else {
        resolve("success");
      }
      return;
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

      let userAgents = await UserAgentResourceAccess.find(filter, skip, limit, order);
      let userAgentsCount = await UserAgentResourceAccess.count(filter, order);
      if (userAgents && userAgentsCount) {
        resolve({ data: userAgents, total: userAgentsCount[0].count });
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
      let userAgentData = req.payload.data;
      let userAgentId = req.payload.id;
      let updateResult = await UserAgentResourceAccess.updateById(userAgentId, userAgentData);
      if (updateResult) {
        resolve("success");
      } else {
        resolve("failed to update user");
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
      let users = await UserAgentResourceAccess.find({ userAgentId: req.payload.id });
      if (users && users.length > 0) {
        let foundUser = users[0];
        resolve(foundUser);
      }
      resolve("failed");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function registerUserAgent(req) {
  return insert(req);
};

async function loginUserAgent(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userName = req.payload.username;
      let password = req.payload.password;

      //verify credential
      let foundUser = await UserAgentFunction.verifyCredentials(userName, password);

      if (foundUser) {

        //create new login token
        let token = TokenFunction.createToken(foundUser);

        foundUser = await UserAgentFunction.retrieveUserDetail(foundUser.userAgentId);

        //if success to get detail
        if (foundUser) {
          foundUser.token = token;
        }

        await UserAgentResourceAccess.updateById(foundUser.userAgentId, { lastActiveAt: new Date() });

        if (foundUser.twoFAEnable && foundUser.twoFAEnable > 0) {
          resolve({
            userAgentId: foundUser.userAgentId,
            twoFAEnable: foundUser.twoFAEnable
          });
        } else {
          resolve(foundUser);
        }
      }

      reject("failed");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function resetPasswordUserAgent(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve("success");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function changePasswordUserAgent(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userName = req.payload.username;
      let password = req.payload.password;
      let newPassword = req.payload.newPassword;
      //verify credential
      let foundUser = await UserAgentFunction.verifyCredentials(userName, password);

      if (foundUser) {
        let result = UserAgentFunction.changeUserPassword(foundUser, newPassword);
        if (result) {
          resolve(result);
        }
      }
      reject("change user password failed")
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
  registerUserAgent,
  loginUserAgent,
  resetPasswordUserAgent,
  changePasswordUserAgent,
};
