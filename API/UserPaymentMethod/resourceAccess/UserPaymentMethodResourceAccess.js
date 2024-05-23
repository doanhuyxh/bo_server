"use strict";
require("dotenv").config();
const { DB, timestamps } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "userpaymentmethod";
const primaryKeyField = "userPaymentMethodId";
async function createTable() {
  console.log(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('userPaymentMethodId').primary();
          table.string('userPaymentMethodName');
          table.string('userPaymentMethodIdentityNumber');
          table.string('userPaymentMethodReferName');
          table.string('userPaymentMethodReceiverName');
          timestamps(table);
          table.index('userPaymentMethodId');
          table.index('userPaymentMethodName');
        })
        .then(async () => {
          console.log(`${tableName} table created done`);
          let userPaymentMethods = {
            userPaymentMethodName: "ATM / Bank",
            userPaymentMethodIdentityNumber: "123577",
            userPaymentMethodReferName: "Citi Bank",
            userPaymentMethodReceiverName: "David Beckam",
          };

          DB(`${tableName}`).insert(userPaymentMethods).then((result) => {
            console.log(`init ${tableName}` + result);
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
  filter.isDeleted = 0;
  return await Common.find(tableName, filter, skip, limit, order);
}

async function count(filter, order) {
  return await Common.count(tableName, primaryKeyField, filter, order);
}

async function findALL(tableName) {
  return await Common.findALL(tableName);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  findALL
};
