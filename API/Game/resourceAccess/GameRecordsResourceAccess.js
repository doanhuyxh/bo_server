"use strict";
require("dotenv").config();
const { DB, timestamps } = require("../../../config/database");
const Common = require('../../Common/resourceAccess/CommonResourceAccess');
const { GAME_RECORD_STATUS } = require('../GameRecordsConstant');

const tableName = "gamerecords";
const primaryKeyField = "gameRecordId";
async function createTable() {
  console.log(`createTable ${tableName}`);
  return new Promise(async (resolve, reject) => {
    DB.schema.dropTableIfExists(`${tableName}`).then(() => {
      DB.schema
        .createTable(`${tableName}`, function (table) {
          table.increments('gameRecordId').primary();
          table.string('gameRecordPrice').notNullable().defaultTo(0);
          table.integer('gameRecordTypeUp').notNullable().defaultTo(0);
          table.integer('gameRecordTypeDown').notNullable().defaultTo(0);
          table.integer('gameRecordTypeOdd').notNullable().defaultTo(0);
          table.integer('gameRecordTypeEven').notNullable().defaultTo(0);
          table.string('gameRecordUnit').notNullable();
          table.string('gameRecordSection').notNullable();
          table.string('gameRecordNote').defaultTo('');
          table.string('gameRecordStatus').defaultTo(GAME_RECORD_STATUS.NEW);
          timestamps(table);
          table.index('gameRecordId');
          table.index('gameRecordPrice');
          table.index('gameRecordNote');
          table.index('gameRecordTypeUp');
          table.index('gameRecordTypeDown');
          table.index('gameRecordTypeOdd');
          table.index('gameRecordTypeEven');
          table.index('gameRecordUnit');
          table.index('gameRecordSection');
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

async function sum(field, filter, order) {
  return await Common.sum(tableName, field, filter, order);
}

async function updateAll(filter, data) {
  return await Common.updateAll(tableName, data, filter);
}

async function findAll(tGameRecords){
  return await Common.findAll(tGameRecords);
}

module.exports = {
  insert,
  find,
  count,
  updateById,
  initDB,
  sum,
  updateAll,
  findAll
};
