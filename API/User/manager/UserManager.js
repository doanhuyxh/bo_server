/**
 * Created by A on 7/18/17.
 */
"use strict";
const UserResourceAccess = require("../resourceAccess/UserResourceAccess");
const StaffResource = require("../../Staff/resourceAccess/StaffResourceAccess");
const WalletUserView = require("../resourceAccess/WalletUserView");
const WalletResourceAccess = require("../../Wallet/resourceAccess/WalletResourceAccess");
const CommonFunctions = require('../../Common/CommonFunctions');
const UserCommissionFunctions = require('../../Commission/UserCommisionFunctions');
const UserFunctions = require("../UserFunctions");
const TokenFunction = require('../../../utils/token');
async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = req.payload;
      let referUserName = userData.referUser;

      //delete userData.referUser;
      let referUserList = [];
      if(referUserName && referUserName !== ""){
        referUserList = await StaffResource.find({ username: referUserName });
        if (referUserList === undefined || referUserList.length < 1) {
          reject("refer user is invalid");
          return;
        }
        //add refer username
        userData.referUser = referUserName;
        userData.referUserId = referUserList[0].staffId;
      }

      //hash password
      userData.password = UserFunctions.hashPassword(userData.password);
      userData.tennganhang= "null"
      //create new user
      let addResult = await UserResourceAccess.insert(userData);
      if (addResult === undefined) {
        reject("can not insert user");
        return;
      } else {
        let newUserId = addResult[0];

        //create Game Wallet and Payment Wallet
        let newWallets = [
          {
            userId: newUserId,
            walletType: 'Game',
            balanceUnit: 'BIT',
            walletAddress: '',
            walletPrivatekey: '',
            walletNote: ''
          }
        ];

        let walletResult = await WalletResourceAccess.insert(newWallets);
        if (walletResult && walletResult.length > 0) {
          //No need
          if (referUserName !== undefined) {
            if (referUserList && referUserList.length > 0) {
              let referId = referUserList[0].staffId;
              if (referId !== newUserId) {
                await UserCommissionFunctions.createUserRelationship(referId, newUserId, 1);
              }
            }
          }
          console.log(3);
          resolve("success");
        } else {
          reject("can not create wallet for user");
          return;
        }
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

      //if agent call this method to get list
      //then we only response list referred user of this agent
      // if (req.currentUser.userAgentId && req.currentUser.userAgentId > 0) {
      //   filter.referUserId = req.currentUser.userAgentId;
      //   delete filter.referUser;
      // }

      let users = await WalletUserView.customSearch(filter, skip, limit, order);
      let usersCount = await WalletUserView.customCount(filter, order);
      if (users && usersCount) {
        resolve({ data: users, total: usersCount[0].count });
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
      let userData = req.payload.data;
      let userId = req.payload.id;
      let updateResult = await UserResourceAccess.updateById(userId, userData);
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

async function staffEditUser(req, res) {
  //Check permission
  await CommonFunctions.checkAllowPermissions(req, res, ["EDIT_USER"]);

  return new Promise(async (resolve, reject) => {
    try {
      let userData = req.payload.data;
      let userId = req.payload.id;
      let updateResult = await UserResourceAccess.updateById(userId, userData);
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
      let users = await WalletUserView.find({ userId: req.payload.id });
      if (users && users.length > 0) {
        let foundUser = users[0];
        if (foundUser) {
          foundUser = await UserFunctions.retrieveUserDetail(foundUser.userId);
          await UserFunctions.retrieveUserTransaction(foundUser);
          resolve(foundUser);
        }
      }
      resolve("failed");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function registerUser(req) {
  return insert(req);
};

async function loginUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userName = req.payload.username;
      let password = req.payload.password;

      //verify credential
      let foundUser = await UserFunctions.verifyCredentials(userName, password);

      if (foundUser) {
        if (!foundUser.active) {
          console.log("chiuj dadya")
          reject("failed");
        }
        
        //create new login token
        let token = TokenFunction.createToken(foundUser);

        foundUser = await UserFunctions.retrieveUserDetail(foundUser.userId);

        //if success to get detail
        if (foundUser) {
          foundUser.token = token;
        }

        foundUser.memberLevelName = await UserFunctions.calculateUserLevelMember(foundUser.userId);

        await UserResourceAccess.updateById(foundUser.userId, { lastActiveAt: new Date() });

        if (foundUser.twoFAEnable && foundUser.twoFAEnable > 0) {
          resolve({
            userId: foundUser.userId,
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

async function resetPasswordUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      reject("failed");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function changePasswordUser(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let userName = req.payload.username;
      let password = req.payload.password;
      let newPassword = req.payload.newPassword;
      //verify credential
      let foundUser = await UserFunctions.verifyCredentials(userName, password);
      console.log("foundUser", foundUser.userId)
      
      
      if (foundUser) {
        let result = UserFunctions.changeUserPassword(foundUser, newPassword);
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

async function staffChangePasswordUser(req, res) {
  //Check permission
  await CommonFunctions.checkAllowPermissions(req, res, ["EDIT_USER"]);

  return new Promise(async (resolve, reject) => {
    try {
      let userName = req.payload.username;
      let newPassword = req.payload.newPassword;
      //verify credential
      let foundUser = await UserResourceAccess.find({username: userName});
      if (foundUser && foundUser.length > 0) {
        foundUser = foundUser[0];
        let result = UserFunctions.changeUserPassword(foundUser, newPassword);
        if (result) {
          resolve(result);
          return;
        }
      }
      reject("change user password failed")
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function verify2FA(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await UserResourceAccess.find({ userId: req.payload.id });
      if (users && users.length > 0) {
        let foundUser = users[0];
        if (foundUser) {
          let otpCode = req.payload.otpCode;

          let verified = UserFunctions.verify2FACode(otpCode.toString(), foundUser.twoFACode);

          if (verified) {
            //create new login token
            let token = TokenFunction.createToken(foundUser);

            foundUser = await UserFunctions.retrieveUserDetail(foundUser.userId);

            //if success to get detail
            if (foundUser) {
              foundUser.token = token;
            }
            foundUser.memberLevelName = await UserFunctions.calculateUserLevelMember(foundUser.userId);
            await UserResourceAccess.updateById(foundUser.userId, {
              twoFAEnable: true,
            });
            resolve(foundUser);
          } else {
            reject("failed to verify2FA");
          }
        } else {
          reject("user is invalid to verify2FA");
        }
      } else {
        reject("user not found to verify2FA");
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
}

module.exports = {
  insert,
  find,
  updateById,
  findById,
  registerUser,
  loginUser,
  resetPasswordUser,
  changePasswordUser,
  verify2FA,
  staffChangePasswordUser,
  staffEditUser
};
