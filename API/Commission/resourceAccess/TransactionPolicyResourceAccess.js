"use strict";
require("dotenv").config();
const { DB, timestamps } = require("../../../config/database")
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "transactionpolicy";
const primaryKeyField = "transactionPolicyId";
const initialData = [
  {
    transactionDailyLimit: 1,
    transactionWeeklyLimit: 1,
    transactionLimit: 1,
    transactionMin: 1,
    transactionMax: 100,
    fee: 0.1,
    policyType: "Last Deposit"
  },
  {
    transactionDailyLimit: 2,
    transactionWeeklyLimit: 2,
    transactionLimit: 2,
    transactionMin: 2,
    transactionMax: 200,
    fee: 0.2,
    policyType: "Deposit ETH to BIT"
  },
  {
    transactionDailyLimit: 1,
    transactionWeeklyLimit: 1,
    transactionLimit: 1,
    transactionMin: 1,
    transactionMax: 300,
    fee: 0.3,
    policyType: "Transfer BIT"
  },
  {
    transactionDailyLimit: 1,
    transactionWeeklyLimit: 1,
    transactionLimit: 1,
    transactionMin: 1,
    transactionMax: 500,
    fee: 0.1,
    policyType: "Withdraw BIT to ETH"
  },
]
async function createTable() {
  console.log(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.float('transactionDailyLimit', 48, 24);
          table.float('transactionWeeklyLimit', 48, 24);
          table.float('transactionLimit', 48, 24);
          table.float('transactionMin', 48, 24);
          table.float('transactionMax', 48, 24);
          table.float('fee');
          table.string('policyType');
          table.string('note');
          timestamps(table);
          table.index(`${primaryKeyField}`);
        })
        .then(() => {
          console.log(`${tableName} table created done`);
          //Init data
          DB(`${tableName}`).insert(initialData).then(() => {
            resolve();
          });
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
