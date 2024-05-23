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
async function fetchETHPrice() {
  let priceToUSD = await CryptoFunction.getPriceByName('ETH');
  if(priceToUSD < 0.1){
    priceToUSD = 1646.6003;
  }
  priceToUSD = makeRandomPrice(priceToUSD);
  //console.log(`priceToUSD ETH ${new Date().toISOString()} - ${priceToUSD}`);
  let percentageChange = 0;
  if(previousPrice) {
    percentageChange = (((priceToUSD - previousPrice) / previousPrice) * 100).toFixed(4);
  }
  previousPrice = priceToUSD;
  MQTTFunction.publishJson("ETH",{
    when: new Date() - 1,
    price: priceToUSD,
    percentage: percentageChange
  })
  GameFunctions.addChartRecord("ETH", {
    when: new Date() - 1,
    price: priceToUSD,
    percentage: percentageChange
  });
}

module.exports = {
  fetchETHPrice
}