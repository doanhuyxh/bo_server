"use strict";
require("dotenv").config();
const { DB, timestamps } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "user";
const primaryKeyField = "userId";
async function createTable() {
  console.log(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('userId').primary();
          table.string('username');
          table.string('firstName');
          table.string('lastName');
          table.string('email');
          table.string('referUserId');
          table.string('referUser');
          table.string('password');
          table.string('socmnd');
          table.string('cmndtruoc');
          table.string('cmndsau');
          table.string('cmndnguoi');
          table.string('memberLevelName').defaultTo('member');
          table.integer('active').defaultTo(1);
          table.float('limitWithdrawDaily', 48, 24).defaultTo(1000000.000);
          table.string('ipAddress');
          table.string('phoneNumber');
          table.string('lastActiveAt');
          table.string('twoFACode');
          table.string('userAvatar');
          table.string('telegramId');
          table.string('facebookId');
          table.string('appleId');
          table.string('zaloId');
          table.string('sotaikhoan').defaultTo('');
          table.string('tentaikhoan').defaultTo('');
          table.string('tennganhang').defaultTo('');
          table.string('note',1000).defaultTo('');
          timestamps(table);
          table.index('userId');
          table.unique('username');
          table.unique('email');
          table.index('memberLevelName');
          table.index('username');
          table.index('firstName');
          table.index('lastName');
          table.index('email');
          table.index('referUserId');
          table.index('password');
          table.index('active');
          table.index('limitWithdrawDaily');
          table.index('ipAddress');
          table.index('phoneNumber');
          table.index('lastActiveAt');
          table.index('referUser');
          table.index('socmnd');
        })
        .then(() => {
          console.log(`${tableName} table created done`);
          resolve();
        });
    });
  });
}

async function initDB() {
  await createTable();
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
  
  if(filterData.stationNewsCategories){
    queryBuilder.where('stationNewsCategories', 'like', `%${filterData.stationNewsCategories}%`)
    delete filterData.stationNewsCategories;
  }

  if(filterData.stationNewsName){
    queryBuilder.where('stationNewsName', 'like', `%${filterData.stationNewsName}%`)
    delete filterData.stationNewsName;
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
    queryBuilder.orderBy("stationNewsUpdatedAt", "desc")
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

async function countNewUser(referAgentId) {
  let today = new Date();
  today.setHours(0);
  today.setMinutes(1);
  let query = DB(tableName).where('createdAt',">=", today);
  if(referAgentId) {
    query.where('referUserId', referAgentId);
  }
  
  let countResult = await query.count(`${primaryKeyField} as count`);
  if(countResult) {
    return countResult[0].count;
  } else {
    return 0;
  }
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  updateAll,
  customCount,
  customSearch,
  countNewUser
};
