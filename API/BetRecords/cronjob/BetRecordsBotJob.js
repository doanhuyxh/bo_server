/**
 * Created by A on 7/18/17.
 */
"use strict";
const BetRecordsFunction = require('../BetRecordsFunctions');
const { BET_TYPE , BET_UNIT } = require('../BetRecordsConstant');
const MQTTFunction = require('../../../ThirdParty/MQTTBroker/MQTTBroker');
const UtilFunctions = require('../../../utils/utilitiesFunction');
const SystemStatus = require('../../Maintain/MaintainFunctions').systemStatus;

setInterval(botPlay, 2000);

const BOT_ID = 1;
function botPlay() {
  if(SystemStatus.autobot === false) {
    return;
  }

  return new Promise(async (resolve, reject) => {
    try {
      // let userId = BOT_ID; //Bot userId

      let betRecordAmountIn = UtilFunctions.getRandomInt(20) * 100000;
      while (betRecordAmountIn < 100000) {
        betRecordAmountIn = UtilFunctions.getRandomInt(20) * 100000;
      }
      let randomType = UtilFunctions.getRandomInt(4);
      let randomUnit = UtilFunctions.getRandomInt(15);
      let betRecordType = BET_TYPE.UP;

      if(randomType === 1) {
        betRecordType = BET_TYPE.UP;
      } else if(randomType === 2) {
        betRecordType = BET_TYPE.DOWN;
      } else if(randomType === 3) {
        betRecordType = BET_TYPE.EVEN;
      } else {
        betRecordType = BET_TYPE.ODD;
      }

      let betRecordUnit = BET_UNIT.BTC;
      if (randomUnit % 2 === 0) {
        betRecordUnit = BET_UNIT.ETH;
      }

      //BOT BET BTC - NO NEED TO RECORD BOT 
      {
        // let result = await BetRecordsFunction.placeUserBet(userId, betRecordAmountIn, betRecordType, betRecordUnit);
        let currentTime = new Date();
        // if(result){
          let result = {
            createdAt: new Date().toISOString(),
            betRecordAmountIn: betRecordAmountIn,
            betRecordType: betRecordType,
            betRecordUnit: betRecordUnit,
            currentSection: currentTime.getHours() + ":" + ((currentTime.getMinutes() * 1) + ":00"),
          };
          MQTTFunction.publishJson("LIVE_RECORD", result);
        // }
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

module.exports = {
  botPlay
};
