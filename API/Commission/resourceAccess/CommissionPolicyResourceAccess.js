"use strict";
require("dotenv").config();
const { DB, timestamps } = require("../../../config/database")
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const tableName = "commissionpolicy";
const primaryKeyField = "commissionPolicyId";

const initialData = [
  {
    level: 1,
    rewardPercentage: 0.1,
    personalKPI: 500,
    systemKPI: 5000,
    childUserCount: 2,
    childUserMemberLevel: 1,
    policyType: 'bet',
    policyMinRequired: 300
  },
  {
    level: 2,
    rewardPercentage: 0.2,
    personalKPI: 800,
    systemKPI: 30000,
    childUserCount: 4,
    childUserMemberLevel: 1,
    policyType: 'bet',
    policyMinRequired: 500
  },
  {
    level: 3,
    rewardPercentage: 0.3,
    personalKPI: 1000,
    systemKPI: 80000,
    childUserCount: 6,
    childUserMemberLevel: 1,
    policyType: 'bet',
    policyMinRequired: 800
  },
  {
    level: 4,
    rewardPercentage: 0.4,
    personalKPI: 1500,
    systemKPI: 200000,
    childUserCount: 8,
    childUserMemberLevel: 1,
    policyType: 'bet',
    policyMinRequired: 1000
  },
  {
    level: 5,
    rewardPercentage: 0.5,
    personalKPI: 2000,
    systemKPI: 5000000,
    childUserCount: 2,
    childUserMemberLevel: 1,
    policyType: 'level',
    policyMinRequired: 4
  },
  {
    level: 6,
    rewardPercentage: 0.6,
    personalKPI: 2500,
    systemKPI: 1000000,
    childUserCount: 2,
    childUserMemberLevel: 1,
    policyType: 'level',
    policyMinRequired: 5
  },
  {
    level: 7,
    rewardPercentage: 0.7,
    personalKPI: 3000,
    systemKPI: 1500000,
    childUserCount: 2,
    childUserMemberLevel: 1,
    policyType: 'bet',
    policyMinRequired: 6
  },
];

async function createTable() {
  console.log(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments(`${primaryKeyField}`).primary();
          table.integer('level');
          table.float('rewardPercentage');
          table.float('personalKPI', 48, 24);
          table.float('systemKPI', 48, 24);
          table.integer('childUserCount');
          table.integer('childUserMemberLevel');
          table.string('policyType');
          table.string('policyMinRequired');
          timestamps(table);
          table.index(`${primaryKeyField}`);
          table.index('policyType');
          table.index('childUserMemberLevel');
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
