/**
 * Created by A on 7/18/17.
 */
"use strict";
const CryptoFunction = require("../../CryptoCurrency/CryptoCurrencyFunctions");
const MQTTFunction = require('../../../ThirdParty/MQTTBroker/MQTTBroker');

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
async function fetchPrice() {
  let cryptoName = 'DOT';
  let priceToUSD = await CryptoFunction.getPriceByName(cryptoName);
  if(priceToUSD < 0.1){
    priceToUSD =  4.0607;
  }
  priceToUSD = makeRandomPrice(priceToUSD);
  
  let percentageChange = 0;
  if(previousPrice) {
    percentageChange = (((priceToUSD - previousPrice) / previousPrice) * 100).toFixed(4);
  }
  previousPrice = priceToUSD;
  //console.log(`priceToUSD ${cryptoName} ${new Date().toISOString()} - ${priceToUSD} ${percentageChange}`);
  MQTTFunction.publishJson(cryptoName,{
    when: new Date() - 1,
    price: priceToUSD,
    percentage: percentageChange
  })
}

module.exports = {
  fetchPrice
}