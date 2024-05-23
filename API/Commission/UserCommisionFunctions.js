/**
 * Created by A on 7/18/17.
 */
'use strict';
const UserCommissionResourceAccess = require('./resourceAccess/UserCommisionResourceAccess');
const BetRecordsResourceAccess = require('../BetRecords/resourceAccess/BetRecordsResourceAccess');
const UserResourceAccess = require('../User/resourceAccess/UserResourceAccess');
async function createUserRelationship(supervisorId, userId, commisionLevel){
  console.log(`createUserRelationship: ${userId} - ${supervisorId} - level: ${commisionLevel}`);
  return new Promise((resolve, reject) => {
    let newUserRelationShip = {
      supervisorId: supervisorId,
      userId: userId,
      commisionLevel: commisionLevel,
    };

    UserCommissionResourceAccess.insert(newUserRelationShip).then(async () => {
      let higherSupervisor = await UserCommissionResourceAccess.find({userId: supervisorId, commisionLevel: 1});

      if(higherSupervisor && higherSupervisor.length > 0){
        higherSupervisor = higherSupervisor[0];
        createUserRelationship(higherSupervisor.supervisorId, userId, commisionLevel + 1).then(() => {
          resolve("success");
        });
      }else{
        resolve("done");
      }
    });
  });
}

async function retriveChildUserAndBetTotal(userId){
  let childUserList = [];
  return new Promise(async (resolve, reject) => {
    let childList = await UserCommissionResourceAccess.find({supervisorId: userId, commisionLevel: 1});
    for (let i = 0; i < childList.length; i++) {
      const childUser = childList[i];
      let user = await UserResourceAccess.find({userId: childUser.userId});
      if(user && user.length > 0){
        user = user[0];
      }else{
        continue;
      }
      let betRecords = await BetRecordsResourceAccess.sum('betRecordAmountIn', {userId: childUser.userId});
      if(betRecords){
        user.totalBet = betRecords[0].sumResult;
      }else{
        user.totalBet = 0
      }
      childUserList.push(user);
    }
    resolve(childUserList);
  });
}

module.exports = {
  createUserRelationship,
  retriveChildUserAndBetTotal
}