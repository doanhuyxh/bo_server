/**
 * Created by A on 7/18/17.
 */
"use strict";
const GameRecordResource = require("../resourceAccess/GameRecordsResourceAccess");
const GameFunction = require('../GameFunctions');
const UtilsFunction = require('../../../utils/utilitiesFunction');
const { GAME_RECORD_STATUS } = require('../GameRecordsConstant');

async function gameRecordList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = {
        gameRecordStatus: GAME_RECORD_STATUS.COMPLETED,
        gameRecordUnit: req.payload.gameRecordUnit
      };
      let orderBy = {
        key: 'updatedAt',
        value: 'desc',
      }
      let gameRecords = await GameRecordResource.find(filter, 0, 50, orderBy);
      let gameRecordsCount = await GameRecordResource.count(filter, orderBy);
      if (gameRecords && gameRecordsCount) {
        console.log("gameRecordList", true)
        resolve({data: gameRecords, total: gameRecordsCount[0].count});
      }else{
        console.log("gameRecordList", false)
        resolve({data: [], total: 0 });
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};
async function gameSectionList(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let sectionList = [];
      let current = new Date();
      for (let i = 0; i < 60; i++) {
        current = current - 1 + 1000 * 60 + 1;
        current = new Date(current);
        let section = {
          label: `${current.getHours()}:${current.getMinutes()}:00`,
          value: `${current.getHours()}:${current.getMinutes()}:00`,
        }
        sectionList.push(section);
      }
      resolve({data: sectionList, total: sectionList.count});
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let gameData = req.payload;
      let gameRecordType = {
        gameRecordTypeUp: gameData.gameRecordTypeUp,
        gameRecordTypeDown: gameData.gameRecordTypeDown,
        gameRecordTypeOdd: gameData.gameRecordTypeOdd,
        gameRecordTypeEven: gameData.gameRecordTypeEven,
      }

      let result = await GameFunction.addNewGameRecord(
          gameData.gameRecordSection, 
          gameData.gameRecordPrice,
          gameData.gameRecordUnit,
          gameRecordType
        );

        console.log("cap nhat game", result)

      if(result){
        resolve(result);
      } else {
        reject("failed");
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;
      let gameRecords = await GameRecordResource.find(filter, skip, limit, order);
      let gameRecordsCount = await GameRecordResource.count(filter, order);
      if (gameRecords && gameRecordsCount) {
        resolve({data: gameRecords, total: gameRecordsCount[0].count});
      }else{
        resolve({data: [], total: 0 });
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let gameRecordId = req.payload.id;
      let gameRecordData = req.payload.data;
      let result = await GameRecordResource.updateById(gameRecordId, gameRecordData);
      if(result){
        resolve(result);
      } else {
        reject("failed");
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve("success");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function insertMany(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let gameData = req.payload;
      let gameRecordCount = req.payload.gameRecordCount;

      let result = undefined;
      let newGameSection = gameData.gameRecordSection;

      let currentSection = new Date();
      currentSection.setHours(newGameSection.split(":")[0]);
      currentSection.setMinutes(newGameSection.split(":")[1]);
      for (let i = 0; i < gameRecordCount; i++) {
        currentSection = currentSection - 1 + 1000 * 60 + 1;
        currentSection = new Date(currentSection);
        let gameSection = `${currentSection.getHours()}:${currentSection.getMinutes()}:00`;
        let betUpDownRandom = UtilsFunction.getRandomInt(9999);
        let betOddEvenRandom = UtilsFunction.getRandomInt(9999);
        if (betUpDownRandom % 2 === 0) {
          betUpDownRandom = 1;
        }

        if (betOddEvenRandom % 2 === 0) {
          betOddEvenRandom = 1;
        }
        let gameRecordType = {
          gameRecordTypeUp: betUpDownRandom === 1,
          gameRecordTypeDown: betUpDownRandom !== 1,
          gameRecordTypeOdd: betOddEvenRandom === 1,
          gameRecordTypeEven: betOddEvenRandom !== 1,
        }
  
        result = await GameFunction.addNewGameRecord(
            gameSection, 
            0,
            gameData.gameRecordUnit,
            gameRecordType
          );
      }

      if(result){
        resolve(result);
      } else {
        reject("failed");
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function gameChartRecordList(req) {
  let dataa = await GameFunction.getChartRecord(req.payload.cryptoCurrency)
  return dataa;
}
module.exports = {
  insert,
  find,
  updateById,
  findById,
  gameRecordList,
  gameSectionList,
  insertMany,
  gameChartRecordList
};

