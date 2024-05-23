/**
 * Created by A on 7/18/17.
 */
"use strict";
const SystemReportFunction = require('../SystemReportFunctions');

async function summaryReport(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let referAgentId = req.currentUser.userAgentId;
      
      if(!referAgentId) {
        referAgentId = req.payload.referAgentId;
      }
      let startDate = req.payload.startDate;
      let endDate = req.payload.endDate;
      let result = await SystemReportFunction.getSummaryReport(startDate, endDate, referAgentId);

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


module.exports = {
  summaryReport,
};
