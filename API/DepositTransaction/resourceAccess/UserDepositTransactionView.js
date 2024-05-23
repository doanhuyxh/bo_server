"use strict";
require("dotenv").config();
const { DB, timestamps } = require("../../../config/database")
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "userdeposittransactionview";

const rootTableName = 'user';
const primaryKeyField = "userId";
async function createUserDepositTransactionView() {
  const depositTableName = 'deposittransaction';
  let fields = [
    `${rootTableName}.userId`,
    `${rootTableName}.sotaikhoan`,
    `${rootTableName}.tentaikhoan`,
    `${rootTableName}.tennganhang`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.firstName`,
    `${rootTableName}.lastName`,
    `${rootTableName}.email`,
    `${rootTableName}.memberLevelName`,
    `${rootTableName}.active`,
    `${rootTableName}.ipAddress`,
    `${rootTableName}.phoneNumber`,
    `${rootTableName}.telegramId`,
    `${rootTableName}.facebookId`,
    `${rootTableName}.appleId`,
    `${rootTableName}.username`,
    `${depositTableName}.status`
  ];

  var viewDefinition = DB.select(fields)
  .from(depositTableName)
  .sum('pointAmount as sumDepositTransactionPointAmount')
  .count('depositTransactionId as countDepositTransaction')
  .sum('otherFee as sumDepositTransactionOtherFee')
  .groupBy(`${rootTableName}.userId`)
  .groupBy(`${depositTableName}.status`)
  .leftJoin(rootTableName, function () {
    this.on(`${rootTableName}.userId`, '=', `${depositTableName}.userId`)
  })
  Common.createOrReplaceView(tableName, viewDefinition)
}

async function initViews() {
  createUserDepositTransactionView();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  let dataId = {};
  dataId[primaryKeyField] = id;
  return await Common.updateById(tableName, dataId, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function sum(field, filter, order) {
  return await Common.sum(tableName, field, filter, order);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initViews,
  sum
};
