"use strict";
require("dotenv").config();
const { DB, timestamps } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "useragent";
const primaryKeyField = "userAgentId";
async function createTable() {
  console.log(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('userAgentId').primary();
          table.string('username');
          table.string('firstName');
          table.string('lastName');
          table.string('email');
          table.string('password');
          table.string('memberLevelName').defaultTo('agent');
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
          timestamps(table);
          table.index('userAgentId');
          table.unique('username');
          table.unique('email');
          table.index('memberLevelName');
          table.index('username');
          table.index('firstName');
          table.index('lastName');
          table.index('email');
          table.index('password');
          table.index('active');
          table.index('limitWithdrawDaily');
          table.index('ipAddress');
          table.index('phoneNumber');
          table.index('lastActiveAt');
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
  return await Common.updateById(tableName, { userAgentId: id }, data);
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

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  updateAll,
};
