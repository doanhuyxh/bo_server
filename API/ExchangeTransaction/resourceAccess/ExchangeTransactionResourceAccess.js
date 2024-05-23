"use strict";
require("dotenv").config();
const { DB, timestamps } = require("../../../config/database")
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const {EXCHANGE_TRX_STATUS} = require('../ExchangeTransactionConstant');
const tableName = "exchangetransaction";
const primaryKeyField = "exchangeTransactionId";
async function createTable() {
  console.log(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('exchangeTransactionId').primary();
          table.integer('userId');
          table.integer('walletId');
          table.integer('targetWalletId');
          table.float('pointAmount', 48, 24).defaultTo(0);
          table.float('ethPrice', 48, 24).defaultTo(0);
          table.float('ethAmount', 48, 24).defaultTo(0);
          table.string('status').defaultTo(EXCHANGE_TRX_STATUS.NEW);
          table.float('ethBegin', 48, 24).notNullable();
          table.float('ethEnd', 48, 24).notNullable();
          table.float('pointBegin', 48, 24).notNullable();
          table.float('pointEnd', 48, 24).notNullable();
          table.string('hash').defaultTo('');
          table.string('walletAddress').defaultTo('');
          table.string('walletType').defaultTo('');
          table.string('exchangeType').defaultTo('');
          table.float('ethFee', 48, 24).defaultTo(0);
          table.float('ethGasFee', 48, 24).defaultTo(0);
          table.float('otherFee', 48, 24).defaultTo(0);
          table.string('note').defaultTo('');
          timestamps(table);
          table.index('userId');
          table.index('walletId');
          table.index('targetWalletId');
          table.index('pointAmount');
          table.index('ethPrice');
          table.index('ethAmount');
          table.index('status');
          table.index('ethBegin');
          table.index('ethEnd');
          table.index('pointBegin');
          table.index('pointEnd');
          table.index('hash');
          table.index('walletAddress');
          table.index('walletType');
          table.index('exchangeType');
          table.index('ethFee');
          table.index('ethGasFee');
          table.index('otherFee');
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
  initDB
};
