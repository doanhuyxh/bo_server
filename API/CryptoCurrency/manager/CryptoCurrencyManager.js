/**
 * Created by A on 7/18/17.
 */
"use strict";

const CryptoCurrencyFunctions = require('../CryptoCurrencyFunctions');

async function getPriceByName(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let currencyCode = req.payload.currencyCode;
      let currentETHPrice = await CryptoCurrencyFunctions.getPriceByName(currencyCode);
      if(currentETHPrice){
        resolve(currentETHPrice);
      }else{
        reject("can not found current price of crypto");
      }
      
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

module.exports = {
  getPriceByName,
};
