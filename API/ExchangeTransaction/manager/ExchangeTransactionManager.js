/**
 * Created by A on 7/18/17.
 */
"use strict";
const ExchangeTransactionAccess = require("../resourceAccess/ExchangeTransactionResourceAccess");
const UserExchangeTransactionView = require("../resourceAccess/UserExchangeTransactionView");
const WalletResourceAccess = require("../../Wallet/resourceAccess/WalletResourceAccess");
const ExchangeTransactionFunction = require("../ExchangeTransactionFunctions");
const CryptoFunction = require("../../CryptoCurrency/CryptoCurrencyFunctions");

//We will use this function if customer accept to use fake eth wallet
//remove after released
async function insertRaw(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let transactionData = req.payload;
      let userId = req.currentUser.userId;
      transactionData.userId = userId;
      let originWallet = await WalletResourceAccess.find({ walletId: transactionData.walletId, userId: transactionData.userId });

      let destinationWallet = undefined;
      if (originWallet && originWallet.length > 0) {
        if (originWallet[0].walletType === "Payment") {
          destinationWallet = await WalletResourceAccess.find({ userId: userId, walletType: "Game" });
        } else {
          destinationWallet = await WalletResourceAccess.find({ userId: userId, walletType: "Payment" });
        }
      }

      if (originWallet === undefined || originWallet.length < 1
        || destinationWallet === undefined || destinationWallet.length < 1) {
        reject("wallet is invalid");
        return;
      }

      originWallet = originWallet[0];
      destinationWallet = destinationWallet[0];

      transactionData.targetWalletId = destinationWallet.walletId;
      let ethPrice = await CryptoFunction.getPriceByName('ETH');
      if (originWallet.walletType === 'Game') {
        let ETHAmount = await ExchangeTransactionFunction.convertBITToETH(transactionData.pointAmount, ethPrice);

        transactionData.exchangeType = "BIT-to-ETH";
        transactionData.pointBegin = originWallet.balance;
        transactionData.pointEnd = originWallet.balance - transactionData.pointAmount;
        transactionData.ethBegin = destinationWallet.balance;
        transactionData.ethEnd = destinationWallet.balance + ETHAmount;

        originWallet.balance = originWallet.balance - transactionData.pointAmount;
        destinationWallet.balance = destinationWallet.balance + ETHAmount;
        let result = await WalletResourceAccess.updateBalanceTransaction([originWallet, destinationWallet]);
        if (result === undefined) {
          reject('failed to exchange ' + transactionData.exchangeType);
          return;
        }

      } else if (originWallet.walletType === 'Payment') {
        let pointAmount = await ExchangeTransactionFunction.convertETHToBIT(transactionData.ethAmount, ethPrice);

        transactionData.exchangeType = "ETH-to-BIT";
        transactionData.ethBegin = originWallet.balance;
        transactionData.ethEnd = originWallet.balance - transactionData.ethAmount;
        transactionData.pointBegin = destinationWallet.balance;
        transactionData.pointEnd = destinationWallet.balance + pointAmount;

        originWallet.balance = originWallet.balance - transactionData.ethAmount;
        destinationWallet.balance = destinationWallet.balance + pointAmount;
        let result = await WalletResourceAccess.updateBalanceTransaction([originWallet, destinationWallet]);
        if (result === undefined) {
          reject('failed to exchange ' + transactionData.exchangeType);
          return;
        }
      }

      transactionData.ethPrice = ethPrice;
      let result = await ExchangeTransactionAccess.insert(transactionData);
      if (result) {
        resolve(result);
      }
      reject("failed to record transaction");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function insert(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let transactionData = req.payload;
      let userId = req.currentUser.userId;
      transactionData.userId = userId;
      let originWallet = await WalletResourceAccess.find({ walletId: transactionData.walletId, userId: transactionData.userId });

      let destinationWallet = undefined;
      if (originWallet && originWallet.length > 0) {
        if (originWallet[0].walletType === "Payment") {
          destinationWallet = await WalletResourceAccess.find({ userId: userId, walletType: "Game" });
        } else {
          destinationWallet = await WalletResourceAccess.find({ userId: userId, walletType: "Payment" });
        }
      }

      if (originWallet === undefined || originWallet.length < 1
        || destinationWallet === undefined || destinationWallet.length < 1) {
        reject("wallet is invalid");
        return;
      }

      originWallet = originWallet[0];
      destinationWallet = destinationWallet[0];

      if (originWallet.walletType === 'Game') {
        let resultexchangeBITToETH = await ExchangeTransactionFunction.exchangeBITToETH(transactionData.pointAmount, originWallet, destinationWallet);
        if(resultexchangeBITToETH){
          resolve("done");
          return;
        }
      } else if (originWallet.walletType === 'Payment') {
        let exchangeETHToBIT = await ExchangeTransactionFunction.exchangeETHToBIT(transactionData.ethAmount, originWallet, destinationWallet);
        if(exchangeETHToBIT){
          resolve("done");
          return;
        }
      }

      reject("transaction failed");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function find(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let filter = req.payload.filter;
      let skip = req.payload.skip;
      let limit = req.payload.limit;
      let order = req.payload.order;

      let transactionList = await UserExchangeTransactionView.find(filter, skip, limit, order);
      let transactionCount = await UserExchangeTransactionView.count(filter, order);
      let transactionSumETH = await UserExchangeTransactionView.sum('ethAmount' ,{
        ...filter,
        walletType: "Payment"
      }, order);

      let transactionSumBIT = await UserExchangeTransactionView.sum('pointAmount', {
        ...filter,
        walletType: "Game"
      }, order);

      if (transactionList && transactionCount && transactionList.length > 0) {
        resolve({
          data: transactionList, 
          total: transactionCount[0].count,
          totalExchangeETH: transactionSumETH.length > 0 ? transactionSumETH[0].sumResult : 0,
          totalExchangeBIT: transactionSumBIT.length > 0 ? transactionSumBIT[0].sumResult : 0,
        });
      } else {
        resolve({
          data: [], 
          total: 0,
          totalExchangeETH: 0,
          totalExchangeBIT: 0,
        });
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

async function updateById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let updateResult = await ExchangeTransactionAccess.updateById(req.payload.id, req.payload.data);
      if (updateResult) {
        resolve(updateResult);
      } else {
        resolve({});
      }
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};
async function findById(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let transactionList = await UserExchangeTransactionView.find({ exchangeTransactionId: req.payload.id });
      if (transactionList) {
        resolve(transactionList[0]);
      } else {
        resolve({});
      }
      resolve("success");
    } catch (e) {
      console.error(e);
      reject("failed");
    }
  });
};

module.exports = {
  insert,
  find,
  updateById,
  findById
};
