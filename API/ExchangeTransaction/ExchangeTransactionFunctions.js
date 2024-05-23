/**
 * Created by A on 7/18/17.
 */
'use strict';
const ExchangeTransactionAccess = require("./resourceAccess/ExchangeTransactionResourceAccess");
const WalletResourceAccess = require("../Wallet/resourceAccess/WalletResourceAccess");
const ExchangeTransactionFunction = require("./ExchangeTransactionFunctions");
const CryptoFunction = require("../CryptoCurrency/CryptoCurrencyFunctions");

const USDPerBIT = 10 //100USD / BIT;

async function convertETHToBIT(ethAmount, ethPrice) {
  return ethAmount * ethPrice / USDPerBIT;
}

async function convertBITToETH(bitAmount, ethPrice) {
  return bitAmount * USDPerBIT / ethPrice;
}

async function exchangeBITToETH(bitAmount, originWallet, destinationWallet) {
  return new Promise(async (resolve, reject) => {
    try {
      let transactionData = {};
      transactionData.userId = originWallet.userId;
      transactionData.targetWalletId = destinationWallet.walletId;
      let ethPrice = await CryptoFunction.getPriceByName('ETH');
      let ethAmount = convertBITToETH(bitAmount, ethPrice);
      let sendResult = await ETHFunctions.sendETH(ethAmount, process.env.ETH_MASTER_ADDRESS, originWallet.walletAddress, process.env.ETH_MASTER_PK);
      if (sendResult === undefined) {
        console.error(`failed to sendETH: ${bitAmount} - ${originWallet.walletAddress} - ${destinationWallet.walletAddress}`);
        resolve(undefined);
        return(undefined);
      }
      
      let ETHAmount = await ExchangeTransactionFunction.convertBITToETH(bitAmount, ethPrice);

      transactionData.exchangeType = "BIT-to-ETH";
      transactionData.pointAmount = bitAmount * -1
      transactionData.pointBegin = originWallet.balance;
      transactionData.pointEnd = originWallet.balance - bitAmount;
      transactionData.ethBegin = destinationWallet.balance;
      transactionData.ethEnd = destinationWallet.balance + ETHAmount;
      originWallet.balance = originWallet.balance - bitAmount;

      let updateResult = await WalletResourceAccess.updateBalanceTransaction([originWallet]);
      if (updateResult === undefined) {
        console.error(`failed to updateBalanceTransaction: ${bitAmount} - ${originWallet.walletAddress} - ${destinationWallet.walletAddress}`);
        console.error(JSON.stringify(originWallet));
        reject(undefined);
        return(undefined);
      }

      let insertResult = await ExchangeTransactionAccess.insert(transactionData);
      if (insertResult) {
        resolve(insertResult);
        return insertResult;
      }else{
        console.error(`failed to ExchangeTransactionAccess.insert: ${bitAmount} - ${originWallet.walletAddress} - ${destinationWallet.walletAddress}`);
        console.error(JSON.stringify(transactionData));
        reject(undefined);
        return(undefined);
      }
    } catch (e) {
      console.error(`EXCEPTION exchangeBITToETH: ${bitAmount} - ${originWallet.walletAddress} - ${destinationWallet.walletAddress}`);
      console.error(e);
      reject("failed");
    }
  });

}
async function exchangeETHToBIT(ethAmount, originWallet, destinationWallet) {
  return new Promise(async (resolve, reject) => {
    try {
      let transactionData = {};
      transactionData.userId = originWallet.userId;
      transactionData.targetWalletId = destinationWallet.walletId;
      let ethPrice = await CryptoFunction.getPriceByName('ETH');

      let sendResult = await ETHFunctions.sendETH(ethAmount, originWallet.walletAddress, process.env.ETH_MASTER_ADDRESS, originWallet.walletPrivatekey);
      if (sendResult === undefined) {
        console.error(`failed to sendETH: ${ethAmount} - ${originWallet.walletAddress} - ${destinationWallet.walletAddress}`);
        reject(undefined);
        return(undefined);
      }

      let pointAmount = await ExchangeTransactionFunction.convertETHToBIT(ethAmount, ethPrice);

      transactionData.exchangeType = "ETH-to-BIT";
      transactionData.ethAmount = ethAmount * -1
      transactionData.ethBegin = originWallet.balance;
      transactionData.ethEnd = originWallet.balance - ethAmount;
      transactionData.pointBegin = destinationWallet.balance;
      transactionData.pointEnd = destinationWallet.balance + pointAmount;
      transactionData.pointAmount = pointAmount
      transactionData.ethPrice = ethPrice;
      let insertResult = await ExchangeTransactionAccess.insert(transactionData);
      if (insertResult) {
        resolve(insertResult);
      }else{
        console.error(`failed to ExchangeTransactionAccess.insert: ${ethAmount} - ${originWallet.walletAddress} - ${destinationWallet.walletAddress}`);
        console.error(JSON.stringify(transactionData));
        reject(undefined);
        return(undefined);
      }
    } catch (e) {
      console.error(`failed to exchangeETHToBIT: ${ethAmount} - ${originWallet.walletAddress} - ${destinationWallet.walletAddress}`);
      console.error(e);
      reject(undefined);
      return(undefined);
    }
  });
}
module.exports = {
  convertETHToBIT,
  convertBITToETH,
  exchangeETHToBIT,
  exchangeBITToETH
}