"use strict";
require("dotenv").config();
const { DB, timestamps } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "role";
const primaryKeyField = "roleId";
async function createTable() {
  console.log(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('roleId').primary();
          table.string('roleName');
          table.string('permissions');
          timestamps(table);
          table.index('roleId');
          table.index('permissions');
          table.index('roleName');
        })
        .then(async () => {
          console.log(`${tableName} table created done`);
          let roles = [
            "Admin",
            "Accountant",
            "Operator",
            "Assistant",
            "Agent",
          ];
          let rolesArr = [];
          let adminPermissions = await DB(`Permission`).select();
          let permissionList = [];
          for (let i = 0; i < adminPermissions.length; i++) {
            const permission = adminPermissions[i];
            permissionList.push(permission.permissionKey);
          }
          permissionList = permissionList.join(',');
          for (let i = 0; i < roles.length; i++) {
            const role = roles[i];
            rolesArr.push({
              roleName: role,
              permissions: permissionList
            });
          }

          DB(`${tableName}`).insert(rolesArr).then((result) => {
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
