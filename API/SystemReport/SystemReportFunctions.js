/**
 * Created by A on 7/18/17.
 */
'use strict';

const UserResource = require('../User/resourceAccess/UserResourceAccess');
const DepositResource = require('../DepositTransaction/resourceAccess/DepositTransactionResourceAccess');
const BetRecordResource = require('../BetRecords/resourceAccess/BetRecordsResourceAccess');
const WithdrawnResource = require('../WithdrawTransaction/resourceAccess/WithdrawTransactionResourceAccess');

async function getSummaryReport(startDate, endDate, referAgentId) {
  let result = {
    newUser: 0,
    allUser: 0,
    totalDeposit: 0,
    totalWithdraw: 0,
    totalBet: 0,
    totalWinLose: 0 
  }
  result.newUser = await UserResource.countNewUser(referAgentId);
  let allUser = 0;

  if (referAgentId && referAgentId > 0) {
    allUser = await UserResource.count({referUserId: referAgentId});
  } else {
    allUser = await UserResource.count({});
  }
  
  if (allUser) {
    result.allUser = allUser[0].count;
  }

  let totalDeposit = await DepositResource.sumaryPointAmount(startDate, endDate, referAgentId);
  if (totalDeposit) {
    result.totalDeposit = totalDeposit[0].sumResult;
  }

  let totalWithdraw = await WithdrawnResource.sumaryPointAmount(startDate, endDate, referAgentId);
  if (totalWithdraw) {
    result.totalWithdraw = totalWithdraw[0].sumResult;
  }

  let totalBet = await BetRecordResource.sumaryPointAmount(startDate, endDate, {}, referAgentId);
  if (totalBet) {
    result.totalBet = totalBet[0].sumResult;
  }

  let totalWinLose = await BetRecordResource.sumaryWinLoseAmount(startDate, endDate, {}, referAgentId);
  if (totalWinLose) {
    result.totalWinLose = totalWinLose[0].sumResult;
  }
  return result;
}

module.exports = {
  getSummaryReport,
}