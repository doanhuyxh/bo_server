"use strict";
require("dotenv").config();
const { DB, timestamps } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "permission";
const primaryKeyField = "permissionId";
async function createTable() {
  console.log(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.string('permissionName');
          table.string('permissionKey');
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index('permissionName');
          table.index('permissionKey');
          table.unique('permissionKey');
        })
        .then(() => {
          console.log(`${tableName} table created done`);
          let initialPermissions = [
            "View Dashboard",
            "View Users",
            "Edit Users",
            "View Deposit",
            "View Withdraw",
            "View Bet History",
            "View User Info",
            "View Commission",
            "View Role",
            "View Maintain",
            "View Game",
            "View Agent",
            "View Payment Method",
            "View Management Info",
          ];
          let permissionArr = [];
          for (let i = 0; i < initialPermissions.length; i++) {
            const permission = initialPermissions[i];
            permissionArr.push({
              permissionName: permission,
              permissionKey: permission.toUpperCase().replace(/\s/ig, '_')
            });
          }

          DB(`${tableName}`).insert(permissionArr).then((result) => {
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
