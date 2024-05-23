"use strict";
require("dotenv").config();
const { DB } = require("../../../config/database")
const Common = require('../../Common/resourceAccess/CommonResourceAccess');

const tableName = "userexchangetransactionview";
const rootTableName = 'exchangetransaction';
const primaryKeyField = "exchangeTransactionId";
async function createUserExchangeTransactionView() {
  const UserTableName = 'user';
  let fields = [
    'exchangeTransactionId',
    `${rootTableName}.userId`,
    'username',
    'pointAmount',
    'ethPrice',
    'ethAmount',
    'ethFee',
    'ethGasFee',
    'otherFee',
    'status',
    'ethBegin',
    'ethEnd',
    'pointBegin',
    'pointEnd',
    'hash',
    `${rootTableName}.note`,
    `${rootTableName}.walletAddress`,
    `${rootTableName}.walletType`,
    `${rootTableName}.createdAt`,
    `${UserTableName}.firstName`,
    `${UserTableName}.lastName`,
    `${UserTableName}.email`,
    `${UserTableName}.memberLevelName`,
    `${UserTableName}.active`,
    `${UserTableName}.ipAddress`,
    `${UserTableName}.phoneNumber`,
    `${UserTableName}.telegramId`,
    `${UserTableName}.facebookId`,
    `${UserTableName}.appleId`,
  ];

  var viewDefinition = DB.select(fields).from(rootTableName).leftJoin(UserTableName, function () {
    this.on(`${rootTableName}.userId`, '=', `${UserTableName}.userId`)
  });

  Common.createOrReplaceView(tableName, viewDefinition)
}

async function initViews() {
  createUserExchangeTransactionView();
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

module.exports = {
  insert,
  find,
  count,
  updateById,
  initViews
};
