/**
 * Created by A on 7/18/17.
 */
'use strict';
const GameRecordsResourceAccess = require('./resourceAccess/GameRecordsResourceAccess');
const { GAME_RECORD_STATUS } = require('./GameRecordsConstant');
const moment = require('moment');
let ETHGameRecord = [];
let BTCGameRecord = [];


async function addNewGameRecord(gameRecordSection, gameRecordPrice, gameRecordUnit, gameRecordType) {
  let existedRecord = await GameRecordsResourceAccess.find({
    gameRecordSection: gameRecordSection,
    gameRecordUnit: gameRecordUnit,
  });

  //if it was predefined by admin, then update status to display it
  if (existedRecord && existedRecord.length > 0) {
    existedRecord = existedRecord[0];
    let gameRecordId = existedRecord.gameRecordId;
    delete existedRecord.gameRecordId;
    existedRecord.gameRecordStatus = GAME_RECORD_STATUS.NEW;
    existedRecord.gameRecordNote = "Admin tạo " + moment().format('hh:mm:ss')
    await GameRecordsResourceAccess.updateById(gameRecordId, existedRecord);
    return existedRecord;
  } else {  
    //else add new records
    let newRecordData = {
      gameRecordSection: gameRecordSection,
      gameRecordUnit: gameRecordUnit,
      gameRecordTypeUp: gameRecordType.gameRecordTypeUp,
      gameRecordTypeDown: gameRecordType.gameRecordTypeDown,
      gameRecordTypeOdd: gameRecordType.gameRecordTypeOdd,
      gameRecordTypeEven: gameRecordType.gameRecordTypeEven,
      gameRecordNote: "Auto tạo " + moment().format('hh:mm:ss')
    };

    if (gameRecordPrice) {
      newRecordData.gameRecordPrice = gameRecordPrice;
      }
      console.log("gameRecordUnit", gameRecordUnit)
    let newRecord = await GameRecordsResourceAccess.insert(newRecordData);
    return newRecord;
  }
}

function checkGameRecordResult(price) {
  let priceString = price + "";
  let lastValue = priceString[(priceString.length - 1)];
  let betUp = 0;
  let betDown = 0;
  let betOdd = 0;
  let betEven = 0;
  if (lastValue * 1 < 5) {
    betDown = 1;
  } else {
    betUp = 1;
  }

  if (lastValue % 2 === 0) {
    betEven = 1;
  } else {
    betOdd = 1;
  }

  let result = {
    gameRecordTypeUp: betUp,
    gameRecordTypeDown: betDown,
    gameRecordTypeOdd: betOdd,
    gameRecordTypeEven: betEven
  }
  return result;
}

function addChartRecord(crypto, record) {
  const maxRecords = 90; //90 secondss
  let newRecord = {
    "gameRecordPrice": record.price,
    "gameRecordSection": moment(record.when).toISOString(),
  };

  if (crypto === 'ETH') {
    newRecord.gameRecordUnit = "ETH-USD";
    ETHGameRecord.push(newRecord)
    if (ETHGameRecord.length > maxRecords) {
      ETHGameRecord.splice(0, 1);
    }
  } else if (crypto === 'BTC') {
    newRecord.gameRecordUnit = "BTC-USD";
    BTCGameRecord.push(newRecord);
    if (BTCGameRecord.length > maxRecords) {
      BTCGameRecord.splice(0, 1);
    }
  }
}

async function getChartRecord(crypto) {



  if (crypto === 'ETH') {
        return {data: ETHGameRecord, total: ETHGameRecord.length};
  } else if (crypto === 'BTC') {
    return {data: BTCGameRecord, total: BTCGameRecord.length};
  }
}

module.exports = {
  addNewGameRecord,
  checkGameRecordResult,
  addChartRecord,
  getChartRecord
}