"use strict";
require("dotenv").config();
const { DB } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "walletuserview";
const rootTableName = 'user';
const primaryKeyField = "userId";

async function createWalletUserView() {
  const WalletTableName = 'wallet';
  let fields = [
    `${rootTableName}.userId`,
    `${rootTableName}.username`,
    `${rootTableName}.firstName`,
    `${rootTableName}.lastName`,
    `${rootTableName}.email`,
    `${rootTableName}.referUserId`,
    `${rootTableName}.referUser`,
    `${rootTableName}.password`,
    `${rootTableName}.memberLevelName`,
    `${rootTableName}.active`,
    `${rootTableName}.limitWithdrawDaily`,
    `${rootTableName}.ipAddress`,
    `${rootTableName}.phoneNumber`,
    `${rootTableName}.lastActiveAt`,
    `${rootTableName}.twoFACode`,
    `${rootTableName}.userAvatar`,
    `${rootTableName}.telegramId`,
    `${rootTableName}.facebookId`,
    `${rootTableName}.appleId`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.sotaikhoan`,
    `${rootTableName}.tentaikhoan`,
    `${rootTableName}.tennganhang`,
    `${rootTableName}.socmnd`,
    `${rootTableName}.cmndtruoc`,
    `${rootTableName}.cmndsau`,
    `${rootTableName}.cmndnguoi`,
    `${WalletTableName}.walletType`,
    `${WalletTableName}.balance`,
    `${WalletTableName}.balanceUnit`,
    `${WalletTableName}.lastDepositAt`,
    `${WalletTableName}.walletAddress`,
    `${WalletTableName}.walletPrivatekey`,
    `${WalletTableName}.walletNote`,
  ];

  var viewDefinition = DB.select(fields).from(rootTableName).leftJoin(WalletTableName, function () {
    this.on(`${rootTableName}.userId`, '=', `${WalletTableName}.userId`);
  }).where({walletType: "Game"});

  Common.createOrReplaceView(tableName, viewDefinition)
}

async function initViews() {
  createWalletUserView();
}

async function insert(data) {
  return await Common.insert(tableName, data);
}

async function updateById(id, data) {
  return await Common.updateById(tableName, { userId: id }, data);
}

async function find(filter, skip, limit, order) {
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function updateAll(data, filter) {
  return await Common.updateAll(tableName, data, filter);
}

function _makeQueryBuilderByFilter(filter, skip, limit, order) {
  let queryBuilder = DB(tableName);
  let filterData = JSON.parse(JSON.stringify(filter));

  if(filterData.username){
    queryBuilder.where('username', 'like', `%${filterData.username}%`)
    delete filterData.username;
  }

  if(filterData.lastName){
    queryBuilder.where('lastName', 'like', `%${filterData.lastName}%`)
    delete filterData.lastName;
  }
  
  if(filterData.firstName){
    queryBuilder.where('firstName', 'like', `%${filterData.firstName}%`)
    delete filterData.firstName;
  }

  if(filterData.email){
    queryBuilder.where('email', 'like', `%${filterData.email}%`)
    delete filterData.email;
  }

  if(filterData.phoneNumber){
    queryBuilder.where('phoneNumber', 'like', `%${filterData.phoneNumber}%`)
    delete filterData.phoneNumber;
  }

  if(filterData.referUser){
    queryBuilder.where('referUser', 'like', `%${filterData.referUser}%`)
    delete filterData.referUser;
  }

  queryBuilder.where(filterData);

  if (limit) {
    queryBuilder.limit(limit);
  }

  if (skip) {
    queryBuilder.offset(skip);
  }

  if (order && order.key !== '' && order.value !== '' && (order.value === 'desc' || order.value === 'asc')) {
    queryBuilder.orderBy(order.key, order.value);
  } else {
    queryBuilder.orderBy("createdAt", "desc")
  }

  return queryBuilder;
}

async function customSearch(filter, skip, limit, order) {
  let query = _makeQueryBuilderByFilter(filter, skip, limit, order);
  return await query.select();
}

async function customCount(filter, order) {
  let query = _makeQueryBuilderByFilter(filter, undefined, undefined, order);
  return await query.count(`${primaryKeyField} as count`);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initViews,
  updateAll,
  customSearch,
  customCount
};
