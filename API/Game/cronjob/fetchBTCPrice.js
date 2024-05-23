/**
 * Created by A on 7/18/17.
 */
"use strict";
const CryptoFunction = require("../../CryptoCurrency/CryptoCurrencyFunctions");
const MQTTFunction = require('../../../ThirdParty/MQTTBroker/MQTTBroker');
const GameFunctions = require('../GameFunctions');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//make random price with variant 0.1%
function makeRandomPrice(currentPrice) {
  let price = currentPrice * 10000;
  let onePercent = price * 0.1 / 100;
  let newPrice = ((price + getRandomInt(onePercent)) / 10000).toFixed(4);
  return newPrice
}

let previousPrice = undefined;
async function fetchBTCPrice() {
  let priceToUSD = await CryptoFunction.getPriceByName('BTC');
  if(priceToUSD < 0.001){
    priceToUSD = 27528.408;
  }
  priceToUSD = makeRandomPrice(priceToUSD);
  //console.log(`priceToUSD BTC ${new Date().toISOString()} - ${priceToUSD}`);
  let percentageChange = 0;
  if(previousPrice) {
    percentageChange = (((priceToUSD - previousPrice) / previousPrice) * 100).toFixed(4);
  }
  previousPrice = priceToUSD;
  MQTTFunction.publishJson("BTC",{
    when: new Date() - 1,
    price: priceToUSD,
    percentage: percentageChange
  });
  GameFunctions.addChartRecord("BTC", {
    when: new Date() - 1,
    price: priceToUSD,
    percentage: percentageChange
  });
}

module.exports = {
  fetchBTCPrice
}