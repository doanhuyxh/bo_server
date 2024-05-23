/**
 * Created by A on 7/18/17.
 */
"use strict";
const RedisFunction = require('../../ThirdParty/Redis/RedisInstance');

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const CRYPTO_CURRENCY = {
  "ETH":"ethereum",
  "ADA":"binance-peg-cardano",
  "BNB":"oec-binance-coin",
  "DOGE":"binance-peg-dogecoin",
  "DOT":"binance-peg-polkadot",
  "LTC":"litecoin",
  "XRP":"ripple",
  "BTC":"bitcoin",
}
async function getPriceByName(cryptoCurrency) {
  return new Promise(async (resolve, reject) => {
    try {
      let cryptoPrice = await RedisFunction.get(`CryptoPrice_${cryptoCurrency}`);

      //console.log(`CryptoPrice_${cryptoCurrency}______`, cryptoPrice)
      if (cryptoPrice > 0) {
        resolve(cryptoPrice);
        return;
      }

      if (cryptoCurrency === 'ETH') {
          let newPrice = await _fetchETHCryptoPrices(cryptoCurrency);
          resolve(newPrice);
      } else if (cryptoCurrency === 'BTC') {
          let newPrice = await _fetchBTCCryptoPrices(cryptoCurrency);
          resolve(newPrice);
      } else {
        let newPrice = await _fetchCryptoPrices(cryptoCurrency);
        resolve(newPrice);
      }

      
    } catch (e) {
      console.error(e);
      resolve(0);
    }
  });
};

const CoinGeckoHost = 'https://api.coingecko.com';

async function _fetchCryptoPrices(cryptoCurrency) {
  const cryptoName = CRYPTO_CURRENCY[cryptoCurrency];
  if(!cryptoName) {
    return -1;
  }

  return new Promise(async (resolve, reject) => {
    try {
      chai
        .request(`${CoinGeckoHost}`)
        .get(`/api/v3/coins/markets?vs_currency=usd&ids=${cryptoName}`)
        .end((err, res) => {
          if(err){
            console.log(err);
            reject(-1);
          }
          let coinMarket = res.body[0];
          if (coinMarket && (coinMarket.symbol.toLowerCase() === cryptoCurrency.toLowerCase()
            || coinMarket.name.toLowerCase() === cryptoCurrency.toLowerCase()
            || coinMarket.id.toLowerCase() === cryptoCurrency.toLowerCase())) {
            resolve(coinMarket.current_price);
            //console.log(`___CryptoPrice_${cryptoCurrency}`, coinMarket.current_price)
            RedisFunction.setWithExpire(`CryptoPrice_${cryptoCurrency}`, coinMarket.current_price, 100) //cache for 5 seconds
          }
          reject(-1);
        });
    } catch (e) {
      console.error(e);
      reject(-1);
    }
  });
}
async function _fetchETHCryptoPrices() {
  const cryptoCurrency = 'ETH'
  return new Promise(async (resolve, reject) => {
    try {
      chai
        .request(`${CoinGeckoHost}`)
        .get(`/api/v3/coins/markets?vs_currency=usd&ids=ethereum`)
        .end((err, res) => {
          if(err){
            console.log(err);
            reject(-1);
          }
          let coinMarket = res.body[0];
          if (coinMarket && (coinMarket.symbol.toLowerCase() === cryptoCurrency.toLowerCase()
            || coinMarket.name.toLowerCase() === cryptoCurrency.toLowerCase()
            || coinMarket.id.toLowerCase() === cryptoCurrency.toLowerCase())) {
            resolve(coinMarket.current_price);
            RedisFunction.setWithExpire(`CryptoPrice_${cryptoCurrency}`, coinMarket.current_price, 20) //cache for 5 seconds
          }
          reject(-1);
        });
    } catch (e) {
      console.error(e);
      reject(-1);
    }
  });
}
async function _fetchBTCCryptoPrices() {
  const cryptoCurrency = 'BTC'
  return new Promise(async (resolve, reject) => {
    try {
      chai
        .request(`${CoinGeckoHost}`)
        .get(`/api/v3/coins/markets?vs_currency=usd&ids=bitcoin`)
        .end((err, res) => {
          if(err){
            console.log(err);
            reject(-1);
          }
          let coinMarket = res.body[0];
          if (coinMarket && (coinMarket.symbol.toLowerCase() === cryptoCurrency.toLowerCase()
            || coinMarket.name.toLowerCase() === cryptoCurrency.toLowerCase()
            || coinMarket.id.toLowerCase() === cryptoCurrency.toLowerCase())) {
            resolve(coinMarket.current_price);
            RedisFunction.setWithExpire(`CryptoPrice_${cryptoCurrency}`, coinMarket.current_price, 20) //cache for 5 seconds
          }
          reject(-1);
        });
    } catch (e) {
      console.error(e);
      reject(-1);
    }
  });
}

module.exports = {
  getPriceByName,
};
