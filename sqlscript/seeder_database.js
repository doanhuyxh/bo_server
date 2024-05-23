const Staff = require("../API/Staff/resourceAccess/StaffResourceAccess")
const BetRecords = require('../API/BetRecords/resourceAccess/BetRecordsResourceAccess');
const DepositTransaction = require('../API/DepositTransaction/resourceAccess/DepositTransactionResourceAccess');
const Role = require('../API/Role/resourceAccess/RoleResourceAccess');
const User = require('../API/User/resourceAccess/UserResourceAccess');
const UserCommision = require('../API/Commission/resourceAccess/UserCommisionResourceAccess');
const Wallet = require('../API/Wallet/resourceAccess/WalletResourceAccess');
const WithdrawTransaction = require('../API/WithdrawTransaction/resourceAccess/WithdrawTransactionResourceAccess');
const ExchangeTransaction = require('../API/ExchangeTransaction/resourceAccess/ExchangeTransactionResourceAccess');
const {DEPOSIT_TRX_STATUS} = require('../API/DepositTransaction/DepositTransactionConstant');
const {WITHDRAW_TRX_STATUS} = require('../API/WithdrawTransaction/WithdrawTransactionConstant');
const {EXCHANGE_TRX_STATUS} = require('../API/ExchangeTransaction/ExchangeTransactionConstant');

async function seedDatabase() {
  console.log("seedDatabase");
  let users = await User.find({}, 0, 10);
  console.log("user ", users)
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    let wallets = await Wallet.find({ userId: user.userId });

    BetRecords.insert({
      userId: user.userId,
      betRecordAmountIn: 100,
      betRecordAmountOut: 200,
    }).then(() => {
      console.log("seeding BetRecords [DONE]");
    });

    DepositTransaction.insert({
      userId: user.userId,
      walletId: wallets[0].walletId,
      pointAmount: 1000,
      ethPrice: 2300,
      ethAmount: 1,
      status: DEPOSIT_TRX_STATUS.COMPLETED,
      ethBegin: 0,
      ethEnd: 1,
      pointBegin: 0,
      pointEnd: 100,
      ethFee: 10 * i,
      ethGasFee: 2 * i,
      otherFee: 5 * i,
      hash: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      walletAddress: wallets[0].walletAddress
    }).then(() => {
      console.log("seeding DepositTransaction [DONE]");
    });

    DepositTransaction.insert({
      userId: user.userId,
      walletId: wallets[1].walletId,
      pointAmount: 1000,
      ethPrice: 2300,
      ethAmount: 1,
      status: DEPOSIT_TRX_STATUS.COMPLETED,
      ethBegin: 0,
      ethEnd: 1,
      pointBegin: 0,
      pointEnd: 100,
      ethFee: 10 * i,
      ethGasFee: 2 * i,
      otherFee: 5 * i,
      hash: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      walletAddress: wallets[1].walletAddress
    }).then(() => {
      console.log("seeding DepositTransaction [DONE]");
    });

    WithdrawTransaction.insert({
      userId: user.userId,
      walletId: wallets[0].walletId,
      pointAmount: 1000,
      ethPrice: 2300,
      ethAmount: 10,
      status: WITHDRAW_TRX_STATUS.COMPLETED,
      ethBegin: 0,
      ethEnd: 10,
      pointBegin: 0,
      pointEnd: 1000,
      hash: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      ethFee: 10 * i,
      ethGasFee: 2 * i,
      otherFee: 5 * i,
      walletAddress: wallets[0].walletAddress
    }).then(() => {
      console.log("seeding WithdrawTransaction [DONE]");
    });

    WithdrawTransaction.insert({
      userId: user.userId,
      walletId: wallets[1].walletId,
      pointAmount: 1000,
      ethPrice: 2300,
      ethAmount: 10,
      status: WITHDRAW_TRX_STATUS.COMPLETED,
      ethBegin: 0,
      ethEnd: 10,
      pointBegin: 0,
      pointEnd: 1000,
      hash: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      ethFee: 10 * i,
      ethGasFee: 2 * i,
      otherFee: 5 * i,
      walletAddress: wallets[1].walletAddress
    }).then(() => {
      console.log("seeding WithdrawTransaction [DONE]");
    });

    ExchangeTransaction.insert({
      userId: user.userId,
      walletId: wallets[0].walletId,
      pointAmount: 1000,
      ethPrice: 2300,
      ethAmount: 1,
      status: EXCHANGE_TRX_STATUS.COMPLETED,
      ethBegin: 0,
      ethEnd: 1,
      pointBegin: 0,
      pointEnd: 100,
      hash: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      ethFee: 10 * i,
      ethGasFee: 2 * i,
      otherFee: 5 * i,
      walletAddress: wallets[0].walletAddress
    }).then(() => {
      console.log("seeding ExchangeTransaction [DONE]");
    });

    ExchangeTransaction.insert({
      userId: user.userId,
      walletId: wallets[1].walletId,
      pointAmount: 1000,
      ethPrice: 2300,
      ethAmount: 1,
      status: EXCHANGE_TRX_STATUS.COMPLETED,
      ethBegin: 0,
      ethEnd: 1,
      pointBegin: 0,
      pointEnd: 100,
      hash: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      ethFee: 10 * i,
      ethGasFee: 2 * i,
      otherFee: 5 * i,
      walletAddress: wallets[1].walletAddress
    }).then(() => {
      console.log("seeding ExchangeTransaction [DONE]");
    });
  }
}

for (let i = 0; i < 10; i++) {
  seedDatabase();
}


