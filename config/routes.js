/**
 * Created by A on 7/18/17.
 */
'use strict';
const Staff                 = require('../API/Staff/route/StaffRoute');
const BetRecords            = require('../API/BetRecords/route/BetRecordsRoute');
const DepositTransaction    = require('../API/DepositTransaction/route/DepositTransactionRoute');
const Role                  = require('../API/Role/route/RoleRoute');
const Permission            = require('../API/Permission/route/PermissionRoute');
const User                  = require('../API/User/route/UserRoute');
const SystemReport          = require('../API/SystemReport/route/SystemReportRoute');
// const Wallet                = require('../API/Wallet/route/WalletRoute');
const WithdrawTransaction   = require('../API/WithdrawTransaction/route/WithdrawTransactionRoute');
const ExchangeTransaction   = require('../API/ExchangeTransaction/route/ExchangeTransactionRoute');
// const CryptoCurrency        = require('../API/CryptoCurrency/route/CryptoCurrencyRoute');
const Game                  = require('../API/Game/route/GameRoute');
// const TransactionPolicy     = require('../API/Commission/route/TransactionPolicyRoute');
// const CommissionPolicy      = require('../API/Commission/route/CommissionPolicyRoute');
const Maintain              = require('../API/Maintain/route/MaintainRoute');
const UserAgent             = require('../API/UserAgent/route/UserAgentRoute');
const Upload                = require('../API/Upload/route/UploadRoute');
const UserPaymentMethod     = require('../API/UserPaymentMethod/route/UserPaymentMethodRoute');
module.exports = [
    { method: 'POST', path: '/Maintain/maintainAll', config: Maintain.maintainAll },
    { method: 'POST', path: '/Maintain/maintainDeposit', config: Maintain.maintainDeposit },
    { method: 'POST', path: '/Maintain/maintainLiveGame', config: Maintain.maintainLiveGame },
    { method: 'POST', path: '/Maintain/maintainTransfer', config: Maintain.maintainTransfer },
    { method: 'POST', path: '/Maintain/maintainWithdraw', config: Maintain.maintainWithdraw },
    { method: 'POST', path: '/Maintain/maintainSignup', config: Maintain.maintainSignup },
    { method: 'POST', path: '/Maintain/maintainForgotPassword', config: Maintain.maintainForgotPassword },
    { method: 'POST', path: '/Maintain/getSystemStatus', config: Maintain.getSystemStatus },
    
    //Bet Records APIs
    { method: 'POST', path: '/BetRecords/insert', config: BetRecords.insert },
    { method: 'POST', path: '/BetRecords/getList', config: BetRecords.find },
    { method: 'POST', path: '/BetRecords/getListLive', config: BetRecords.findLive },
    { method: 'POST', path: '/BetRecords/getDetailById', config: BetRecords.findById },
    { method: 'POST', path: '/BetRecords/summaryUser', config: BetRecords.summaryUser },
    
    //Bet Records APIs for Staff
    { method: 'POST', path: '/BetRecords/summaryAll', config: BetRecords.summaryAll },
    { method: 'POST', path: '/BetRecords/staffFind', config: BetRecords.staffFind },

    // Game APIs
    { method: 'POST', path: '/Game/gameRecordList', config: Game.gameRecordList },
    { method: 'POST', path: '/Game/gameChartRecordList', config: Game.gameChartRecordList },
    { method: 'POST', path: '/Game/gameSectionList', config: Game.gameSectionList },
    { method: 'POST', path: '/Game/insert', config: Game.insert },
    { method: 'POST', path: '/Game/insertMany', config: Game.insertMany },
    { method: 'POST', path: '/Game/getList', config: Game.find },
    { method: 'POST', path: '/Game/getDetailById', config: Game.findById },
    { method: 'POST', path: '/Game/updateById', config: Game.updateById },
    
    //DepositTransaction APIs
    { method: 'POST', path: '/DepositTransaction/insert', config: DepositTransaction.insert },
    { method: 'POST', path: '/DepositTransaction/findByUser', config: DepositTransaction.findByUser },
    { method: 'POST', path: '/DepositTransaction/getList', config: DepositTransaction.find },
    { method: 'POST', path: '/DepositTransaction/getDetailById', config: DepositTransaction.findById },
    { method: 'POST', path: '/DepositTransaction/summaryUser', config: DepositTransaction.summaryUser },
    
    //DepositTransaction Staff APIs
    { method: 'POST', path: '/DepositTransaction/addUserPointByStaff', config: DepositTransaction.addUserPointByStaff },
    { method: 'POST', path: '/DepositTransaction/approveDepositTransaction', config: DepositTransaction.approveDepositTransaction },
    { method: 'POST', path: '/DepositTransaction/denyDepositTransaction', config: DepositTransaction.denyDepositTransaction },
    { method: 'POST', path: '/DepositTransaction/updateById', config: DepositTransaction.updateById },
    { method: 'POST', path: '/DepositTransaction/summaryAll', config: DepositTransaction.summaryAll },
    

    //WithdrawTransaction APIs
    { method: 'POST', path: '/WithdrawTransaction/insert', config: WithdrawTransaction.insert },
    { method: 'POST', path: '/WithdrawTransaction/getList', config: WithdrawTransaction.find },
    { method: 'POST', path: '/WithdrawTransaction/findByUser', config: WithdrawTransaction.findByUser },
    { method: 'POST', path: '/WithdrawTransaction/getDetailById', config: WithdrawTransaction.findById },
    { method: 'POST', path: '/WithdrawTransaction/summaryUser', config: WithdrawTransaction.summaryUser },

    //WithdrawTransaction APIs for staffs
    { method: 'POST', path: '/WithdrawTransaction/acceptRequest', config: WithdrawTransaction.staffAcceptRequest },
    { method: 'POST', path: '/WithdrawTransaction/rejectRequest', config: WithdrawTransaction.staffRejectRequest },
    { method: 'POST', path: '/WithdrawTransaction/summaryAll', config: WithdrawTransaction.summaryAll },

    // WithdrawTransaction APIs
    // { method: 'POST', path: '/TransactionPolicy/insert', config: WithdrawTransaction.insert },
    // { method: 'POST', path: '/TransactionPolicy/getList', config: TransactionPolicy.find },
    // { method: 'POST', path: '/TransactionPolicy/getDetailById', config: TransactionPolicy.findById },
    // { method: 'POST', path: '/TransactionPolicy/updateById', config: TransactionPolicy.updateById },

    //WithdrawTransaction APIs
    // { method: 'POST', path: '/CommissionPolicy/insert', config: WithdrawTransaction.insert },
    // { method: 'POST', path: '/CommissionPolicy/getList', config: CommissionPolicy.find },
    // { method: 'POST', path: '/CommissionPolicy/getDetailById', config: CommissionPolicy.findById },
    // { method: 'POST', path: '/CommissionPolicy/updateById', config: CommissionPolicy.updateById },


    //ExchangeTransaction APIs
    { method: 'POST', path: '/ExchangeTransaction/insert', config: ExchangeTransaction.insert },
    { method: 'POST', path: '/ExchangeTransaction/getList', config: ExchangeTransaction.find },
    { method: 'POST', path: '/ExchangeTransaction/getDetailById', config: ExchangeTransaction.findById },
    { method: 'POST', path: '/ExchangeTransaction/updateById', config: ExchangeTransaction.updateById },


    //Staff APIs
    { method: 'POST', path: '/Staff/loginStaff', config: Staff.loginStaff },
    { method: 'POST', path: '/Staff/registerStaff', config: Staff.registerStaff },
    { method: 'POST', path: '/Staff/updateStaffById', config: Staff.updateById },
    { method: 'POST', path: '/Staff/getListStaff', config: Staff.find },
    { method: 'POST', path: '/Staff/getDetailStaff', config: Staff.findById },
    // { method: 'POST', path: '/Staff/resetPasswordStaff', config: Staff.resetPasswordStaff },
    { method: 'POST', path: '/Staff/changePasswordStaff', config: Staff.changePasswordStaff },

    // //User APIs
    { method: 'POST', path: '/User/registerUser', config: User.registerUser },
    { method: 'POST', path: '/User/loginUser', config: User.loginUser },
    { method: 'POST', path: '/User/getListlUser', config: User.find },
    { method: 'POST', path: '/User/getDetailUserById', config: User.findById },
    { method: 'POST', path: '/User/updateUserById', config: User.updateById },
    { method: 'POST', path: '/User/resetPasswordUser', config: User.resetPasswordUser },
    { method: 'POST', path: '/User/changePasswordUser', config: User.changePasswordUser },
    { method: 'POST', path: '/User/verify2FA', config: User.verify2FA },
    { method: 'GET', path: '/User/get2FACode', config: User.get2FACode },

    // //User APIs for staff
    
    { method: 'POST', path: '/User/staffChangePasswordUser', config: User.staffChangePasswordUser },
    { method: 'POST', path: '/User/staffEditUser', config: User.staffEditUser },

    //User Payment method APIs
    { method: 'POST', path: '/UserPaymentMethod/insert', config: UserPaymentMethod.insert },
    { method: 'POST', path: '/UserPaymentMethod/getList', config: UserPaymentMethod.findALL },
    { method: 'POST', path: '/UserPaymentMethod/getDetailById', config: UserPaymentMethod.findById },
    { method: 'POST', path: '/UserPaymentMethod/updateById', config: UserPaymentMethod.updateById },
    { method: 'POST', path: '/UserPaymentMethod/findALL', config: UserPaymentMethod.findALL },
    
    //User Agent APIs
    { method: 'POST', path: '/UserAgent/registerUser', config: UserAgent.registerUserAgent },
    { method: 'POST', path: '/UserAgent/loginUser', config: UserAgent.loginUserAgent },
    { method: 'POST', path: '/UserAgent/getListlUser', config: UserAgent.find },
    { method: 'POST', path: '/UserAgent/getDetailUserById', config: UserAgent.findById },
    { method: 'POST', path: '/UserAgent/updateUserById', config: UserAgent.updateById },
    { method: 'POST', path: '/UserAgent/resetPasswordUser', config: UserAgent.resetPasswordUserAgent },
    { method: 'POST', path: '/UserAgent/changePasswordUser', config: UserAgent.changePasswordUserAgent },
    
    //Role APIs
    { method: 'POST', path: '/Role/insert', config: Role.insert },
    { method: 'POST', path: '/Role/getList', config: Role.find },
    // { method: 'POST', path: '/Role/getDetailById', config: Role.findById },
    { method: 'POST', path: '/Role/updateById', config: Role.updateById },

    //Permission APIs
    { method: 'POST', path: '/Permission/insert', config: Permission.insert },
    { method: 'POST', path: '/Permission/getList', config: Permission.find },
    { method: 'POST', path: '/Permission/getDetailById', config: Permission.findById },
    { method: 'POST', path: '/Permission/updateById', config: Permission.updateById },

    //Upload APIs
    { method: 'POST', path: '/Upload/uploadMediaFile', config: Upload.uploadMediaFile },
    {
        method: 'GET',
        path: '/uploads/{filename}',
        handler: function (request, h) {
            return h.file(`uploads/${request.params.filename}`);
        }
    },
    {
        method: 'GET',
        path: '/servertime',
        handler: function (request, h) {
            return h(new Date().toLocaleString());
        }
    },
    //Report APIs
    { method: 'POST', path: '/SystemReport/summaryReport', config: SystemReport.summaryReport },
];
