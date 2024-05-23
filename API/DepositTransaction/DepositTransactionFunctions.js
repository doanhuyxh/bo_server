/**
 * Created by A on 7/18/17.
 */
'use strict';
const DepositTransactionAccess = require("./resourceAccess/DepositTransactionResourceAccess");
const UserWallet = require('../Wallet/resourceAccess/WalletResourceAccess');
const { DEPOSIT_TRX_STATUS } = require('./DepositTransactionConstant');

async function createDepositTransaction(user, amount, status, hinhxacnhan){
  let wallet = await UserWallet.find({userId: user.userId});
  if (!wallet || wallet.length < 1) {
    console.error("user wallet is invalid");
    return undefined;
  }
  wallet = wallet[0];

  let pointBegin = wallet.balance;
  let transactionData = {
    userId: user.userId,
    walletid: wallet.walletId,
    pointAmount: amount,
    pointBegin: pointBegin,
    pointEnd: pointBegin + amount,
    sotaikhoan: user.sotaikhoan,
    tentaikhoan: user.tentaikhoan,
    tennganhang: user.tennganhang,
    note: `Tên tài khoản: ${user.username} \r\n Tên ngân hàng: ${user.tennganhang} \r\n Số tài khoản: ${user.sotaikhoan} \r\n Chủ tài khoản: ${user.tentaikhoan}`,
    ethBegin: 0, //add to pass db validation
    ethEnd: 0 //add to pass db validation
  };
  // if (hinhxacnhan) {
  //   transactionData.hinhxacnhan = hinhxacnhan;
  // } else {
  //   transactionData.hinhxacnhan = "";
  // }
  if (status && status !== "") {
    transactionData.status = status;
    if (status === DEPOSIT_TRX_STATUS.COMPLETED) {
      transactionData.note = `Tên tài khoản: ${user.username} \r\n Tên ngân hàng: ${user.tennganhang} \r\n Số tài khoản: ${user.sotaikhoan} \r\n Chủ tài khoản: ${user.tentaikhoan} \r\n Admin tự thêm ${new Date().toISOString()}`;
    }
  };

  if (user.referUserId) {
    transactionData.referId = user.referUserId;
  }

  let result = await DepositTransactionAccess.insert(transactionData);
  if (result) {
    return result;
  } else {
    console.error("insert deposit trx error");
    return undefined;
  }
}

async function approveDepositTransaction(transactionId){
  let transaction = await DepositTransactionAccess.find({depositTransactionId: transactionId});
  if (!transaction || transaction.length < 1) {
    console.error("transaction is invalid");
    return undefined;
  }
  transaction = transaction[0];
  
  if (transaction.status !== DEPOSIT_TRX_STATUS.NEW && transaction.status !== DEPOSIT_TRX_STATUS.WAITING && transaction.status !== DEPOSIT_TRX_STATUS.PENDING) {
    console.error("deposit transaction was approved or canceled");
    return undefined;
  }

  let wallet = await UserWallet.find({userId: transaction.userId});
  if (!wallet || wallet.length < 1) {
    console.error("user wallet is invalid");
    return undefined;
  }
  wallet = wallet[0];

  transaction.status = DEPOSIT_TRX_STATUS.COMPLETED;
  transaction.note = transaction.note + '\r\n' + `xac nhan giao dich ${new Date().toISOString()}`
  delete transaction.depositTransactionId;

  let updateTransactionResult = await DepositTransactionAccess.updateById(transactionId, transaction);
  if (updateTransactionResult) {
    let updateWalletResult = UserWallet.incrementBalance(wallet.walletId, transaction.pointAmount);
    if (updateWalletResult) {
      return updateWalletResult;
    } else {
      console.error(`updateWalletResult error wallet.walletId ${wallet.walletId} - ${JSON.stringify(transaction)}`);
      return undefined;
    }
  } else {
    console.error("approveDepositTransaction error");
    return undefined;
  }
}

module.exports = {
  createDepositTransaction,
  approveDepositTransaction
}