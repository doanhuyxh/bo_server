/**
 * Created by A on 7/18/17.
 */
'use strict'
const GameSchedule = require('./API/Game/cronjob/GameSchedule');

async function startSchedule() {
    console.log("startSchedule")
    GameSchedule.startSchedule();
}

module.exports = {
    startSchedule,
};
