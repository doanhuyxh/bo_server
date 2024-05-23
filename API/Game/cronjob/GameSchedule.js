const { CronInstance, executeJob } = require("../../../ThirdParty/Cronjob/CronInstance");
const Logger = require('../../../utils/logging');
const SystemStatus = require('../../Maintain/MaintainFunctions').systemStatus;
const GamePlay = require('./addGameResult');
const { resetDailyGame } = require("./resetGameResult");

async function _startCronSchedule() {
  Logger.info("startSchedule ", new Date());

  //do not run schedule on DEV environments
  if (process.env.ENV === 'dev') {
    return;
  }

  //every 5 minutes
  CronInstance.schedule('* * * * *', async function () {
    GamePlay.addNewGameResult('ETH');
    GamePlay.addNewGameResult('BTC');
  });

  // daily task
  CronInstance.schedule('1 0 * * *', async function () {
    resetDailyGame();
  });
}

async function startSchedule() {
  console.log("start GameSchedule");
  const ethJob = require('./fetchETHPrice');
  const btcJob = require('./fetchBTCPrice');
  const adaJob = require('./fetchADAPrice');
  const bnbJob = require('./fetchBNBPrice');
  const dogeJob = require('./fetchDOGEPrice');
  const dotJob = require('./fetchDOTPrice');
  const ltcJob = require('./fetchLTCPrice');
  const xrpJob = require('./fetchXRPPrice');

  function fetchETHPrice() {
    if (SystemStatus.liveGame) {
      ethJob.fetchETHPrice();
      btcJob.fetchBTCPrice();
      xrpJob.fetchPrice();
      adaJob.fetchPrice();
      bnbJob.fetchPrice();
      dogeJob.fetchPrice();
      dotJob.fetchPrice();
      ltcJob.fetchPrice();
    }
  }
  setInterval(() => {
    //GamePlay.runAllTask()
    fetchETHPrice();
  }, 1000);
}
_startCronSchedule();

module.exports = {
  startSchedule,
};
