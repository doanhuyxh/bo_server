const Staff = require('../API/Staff/resourceAccess/StaffResourceAccess');
const GameRecords = require('../API/Game/resourceAccess/GameRecordsResourceAccess');
const BetRecords = require('../API/BetRecords/resourceAccess/BetRecordsResourceAccess');
const UserBetRecordsView = require('../API/BetRecords/resourceAccess/UserBetRecordsView');
const DepositTransaction = require('../API/DepositTransaction/resourceAccess/DepositTransactionResourceAccess');
const Role = require('../API/Role/resourceAccess/RoleResourceAccess');
const RoleStaffView = require('../API/Staff/resourceAccess/RoleStaffView');
const User = require('../API/User/resourceAccess/UserResourceAccess');
const UserAgent = require('../API/UserAgent/resourceAccess/UserAgentResourceAccess');
const WalletUserView = require('../API/User/resourceAccess/WalletUserView');
const UserCommision = require('../API/Commission/resourceAccess/UserCommisionResourceAccess');
const Wallet = require('../API/Wallet/resourceAccess/WalletResourceAccess');
const WithdrawTransaction = require('../API/WithdrawTransaction/resourceAccess/WithdrawTransactionResourceAccess');
const ExchangeTransaction = require('../API/ExchangeTransaction/resourceAccess/ExchangeTransactionResourceAccess');
const UserDepositTransactionView = require('../API/DepositTransaction/resourceAccess/UserDepositTransactionView');
const UserExchangeTransactionView = require('../API/ExchangeTransaction/resourceAccess/UserExchangeTransactionView');
const UserWithdrawTransactionView = require('../API/WithdrawTransaction/resourceAccess/UserWithdrawTransactionView');
const DepositTransactionUserView = require('../API/DepositTransaction/resourceAccess/DepositTransactionUserView');
const WithdrawTransactionUserView = require('../API/WithdrawTransaction/resourceAccess/WithdrawTransactionUserView');
const Permission = require('../API/Permission/resourceAccess/PermissionResourceAccess');
const CommissionPolicyResourceAccess = require('../API/Commission/resourceAccess/CommissionPolicyResourceAccess');
const TransactionPolicyResourceAccess = require('../API/Commission/resourceAccess/TransactionPolicyResourceAccess');
const UserPaymentMethod = require('../API/UserPaymentMethod/resourceAccess/UserPaymentMethodResourceAccess');


async function createDatabase(){
  //create tables
  await BetRecords.initDB();  
  await User.initDB();
  await UserAgent.initDB();
  await UserCommision.initDB();
  await Wallet.initDB();
  await Permission.initDB();
  await Role.initDB();
  await Staff.initDB();
  await WithdrawTransaction.initDB();
  await DepositTransaction.initDB();
  await ExchangeTransaction.initDB();
  await TransactionPolicyResourceAccess.initDB();
  await CommissionPolicyResourceAccess.initDB();
  await GameRecords.initDB();
  await UserPaymentMethod.initDB();

  //create views
  UserBetRecordsView.initViews();
  UserDepositTransactionView.initViews();
  UserExchangeTransactionView.initViews();
  UserWithdrawTransactionView.initViews();
  DepositTransactionUserView.initViews();
  WithdrawTransactionUserView.initViews();
  WalletUserView.initViews();
  RoleStaffView.initViews();
}
createDatabase();

