/**
 * Created by A on 7/18/17.
 */
'use strict';
const token = require('../../utils/token');
const errorCodes = require('./route/response').errorCodes;
const SystemStatus = require('../Maintain/MaintainFunctions').systemStatus;
const UserResource = require('../User/resourceAccess/UserResourceAccess');
const StaffResource = require('../Staff/resourceAccess/StaffResourceAccess');

async function verifyToken(request, reply) {
  
  return new Promise(async function (resolve) {
    let result = token.decodeToken(request.headers.authorization);
    //append current user to request
    request.currentUser = result;
    if (!request.currentUser.active) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    if (result === undefined || (result.userId && SystemStatus.all === false)) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    if (result.userId) {
      let currentUser = await UserResource.find({userId: result.userId});
      if (currentUser && currentUser.length > 0 && currentUser[0].active) {
        resolve("ok");
      } else {
        reply.response(errorCodes[505]).code(505).takeover();
        return;
      }
    } else if (result.staffId) {
      let currentStaff = await StaffResource.find({staffId: result.staffId});
      if (currentStaff && currentStaff.length > 0 && currentStaff[0].active) {
        resolve("ok");
      } else {
        reply.response(errorCodes[505]).code(505).takeover();
        return;
      }
    }
    resolve("ok");
  }).then(function () {
    reply('pre-handler done');
  });
}

async function verifyStaffToken(request, reply) {
  return new Promise(function (resolve) {
    let currentUser = request.currentUser;

    if (!currentUser.staffId || currentUser.staffId < 1) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    if (!currentUser.roleId || currentUser.roleId < 1) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    const AGENT_ROLE = 5;
    if(currentUser.roleId === AGENT_ROLE) {
      //if it is agent, reject user
      reply.response(errorCodes[505]).code(505).takeover();
    }

    resolve("ok");
  }).then(function () {
    reply('pre-handler done');
  });
}

async function verifyAgentOrStaffToken(request, reply) {
  return new Promise(function (resolve) {
    let currentUser = request.currentUser;

    //check staff valid
    if (currentUser.staffId && currentUser.staffId > 0) {
      //check role
      if (!currentUser.roleId || currentUser.roleId < 1) {
        reply.response(errorCodes[505]).code(505).takeover();
        return;
      }
    } else if (currentUser.userAgentId && currentUser.userAgentId > 0) {
      //check agent valid and do nothing
    } else {
      //if it is something else, not agent nor staff
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }
    
    const AGENT_ROLE = 5;
    if(currentUser.roleId === AGENT_ROLE) {
      currentUser.userAgentId = currentUser.staffId;
    }
    resolve("ok");
  }).then(function () {
    reply('pre-handler done');
  });
}

async function checkAllowPermissions(request, res, requiredPermissions) {
  return new Promise(function (resolve) {
    let userPermissions = request.currentUser.permissions;
    if (!userPermissions) {
      res(errorCodes[505]).code(505).takeover();
      return;
    }

    let allowed = false;
    if (requiredPermissions && requiredPermissions.length > 0) {
      for (let i = 0; i < requiredPermissions.length; i++) {
        const permission = requiredPermissions[i];
        if (userPermissions.indexOf(permission) > -1){
          allowed = true;
          break;
        }
      }
    }

    if (allowed === false) {
      res(errorCodes[505]).code(505).takeover();
      return;
    }

    resolve("ok");
  });
}

//verify token is belong to user or not
//to make sure they can not get info or update other user
async function verifyOwnerToken(request, reply) {
  return new Promise(function (resolve) {
    let currentUser = request.currentUser;
    let userId = request.payload.id;

    if (userId && currentUser.userId && userId !== currentUser.userId) {
      reply.response(errorCodes[505]).code(505).takeover();
      return;
    }

    resolve("ok");
  }).then(function () {
    reply('pre-handler done');
  });
}
module.exports = {
  verifyToken,
  verifyStaffToken,
  verifyAgentOrStaffToken,
  checkAllowPermissions,
  verifyOwnerToken
};
