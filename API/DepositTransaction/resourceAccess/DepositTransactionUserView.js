"use strict";
require("dotenv").config();
const { DB } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');

const tableName = "deposittransactionuserview";
const rootTableName = 'deposittransaction';
const primaryKeyField = "depositTransactionId";
async function createView() {
  const UserTableName = 'User';
  let fields = [
    'depositTransactionId',
    `${rootTableName}.userId`,
    'username',
    'pointAmount',
    'ethPrice',
    'ethAmount',
    'ethBegin',
    'ethEnd',
    'pointBegin',
    'pointEnd',
    'hash',
    'ethFee',
    'ethGasFee',
    'otherFee',
    `${rootTableName}.note`,
    `${rootTableName}.walletAddress`,
    `${rootTableName}.walletType`,
    `${rootTableName}.createdAt`,
    `${rootTableName}.walletId`,
    `${rootTableName}.referId`,
    `${rootTableName}.status`,
    `${rootTableName}.sotaikhoan`,
    `${rootTableName}.tentaikhoan`,
    `${rootTableName}.tennganhang`,
    `${rootTableName}.hinhxacnhan`,
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
  createView();
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
  sum,
  customSearch,
  customCount
};
