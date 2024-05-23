/**
 * Created by A on 7/18/17.
 */
"use strict";
const GameRecordsResourceAccess = require('../resourceAccess/GameRecordsResourceAccess');

async function resetDailyGame(){
  GameRecordsResourceAccess.initDB();
}

module.exports = {
  resetDailyGame
}