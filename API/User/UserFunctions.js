/**
 * Created by A on 7/18/17.
 */
'use strict';

const UserResourceAccess = require("./resourceAccess/UserResourceAccess");
const WalletResourceAccess = require("../Wallet/resourceAccess/WalletResourceAccess");
const UserCommissionResource = require('../../API/Commission/resourceAccess/UserCommisionResourceAccess');
const BetRecordResourceAccess = require('../BetRecords/resourceAccess/BetRecordsResourceAccess');
const DepositResource = require("../DepositTransaction/resourceAccess/DepositTransactionResourceAccess")
const WithdrawResource = require("../WithdrawTransaction/resourceAccess/WithdrawTransactionResourceAccess")
const { DEPOSIT_TRX_STATUS } = require('../DepositTransaction/DepositTransactionConstant');
const { WITHDRAW_TRX_STATUS } = require('../WithdrawTransaction/WithdrawTransactionConstant');
const QRCodeFunction = require('../../ThirdParty/QRCode/QRCodeFunctions');

const crypto = require("crypto");
const otplib = require('otplib');

/** Gọi ra để sử dụng đối tượng "authenticator" của thằng otplib */
const { authenticator } = otplib
/** Tạo secret key ứng với từng user để phục vụ việc tạo otp token.
  * Lưu ý: Secret phải được gen bằng lib otplib thì những app như
    Google Authenticator hoặc tương tự mới xử lý chính xác được.
  * Các bạn có thể thử để linh linh cái secret này thì đến bước quét mã QR sẽ thấy có lỗi ngay.
*/
const generateUniqueSecret = () => {
    return authenticator.generateSecret()
}

/** Tạo mã OTP token */
const generateOTPToken = (username, serviceName, secret) => {
    return authenticator.keyuri(username, serviceName, secret)
}

function hashPassword(password) {
    const hashedPassword = crypto
        .createHmac("sha256", "ThisIsSecretKey")
        .update(password)
        .digest("hex");
    return hashedPassword;
}

function unhashPassword(hash) {
    const pass = cryptr.decrypt(hash);
    return pass;
}

function verifyUniqueUser(req, res) {
    // Find an entry from the database that
    // matches either the email or username
}

async function verifyCredentials(username, password) {
    let hashedPassword = hashPassword(password);
    // Find an entry from the database that
    // matches either the email or username
    let verifyResult = await UserResourceAccess.find({
        username: username,
        password: hashedPassword
    });

    if (verifyResult && verifyResult.length > 0) {
        return verifyResult[0];
    } else {
        return undefined;
    }
}

async function retrieveUserDetail(userId) {
    //get user detial
    let user = await UserResourceAccess.find({ userId: userId });
    if (user && user.length > 0) {
        let foundUser = user[0];
        //get wallet data
        let wallets = await WalletResourceAccess.find({ userId: foundUser.userId });
        if (wallets) {
            foundUser.wallets = wallets;
        }

        //get total bet
        foundUser.totalBet = 0;
        let totalBet = await BetRecordResourceAccess.sum('betRecordAmountIn', { userId: userId });

        foundUser.totalBet = totalBet[0].sumResult;

        return foundUser;
    }
    return undefined;
}

async function changeUserPassword(userData, newPassword) {
    let newHashPassword = hashPassword(newPassword);

    let result = await UserResourceAccess.updateById(userData.userId, { password: newHashPassword });

    if (result) {
        return result;
    } else {
        return undefined;
    }
}

async function _getActualLevel(expectLevel, requireBet, members) {
    let actualLevel = expectLevel;
    for (let i = 0; i < members.length; i++) {
        const member = members[i];
        let systemBet = await BetRecordResourceAccess.sum('betRecordAmountIn', { userId: member.userId });
        if (systemBet < requireBet) {
            actualLevel = 0;
            break;
        }
    }
    return actualLevel;
}
async function _calculateActualLevel(expectLevel, requireBet, members) {
    let actualLevel = 0;
    for (let i = 4; i > 0; i--) {
        actualLevel = await _getActualLevel(expectLevel, requireBet, members);
        if (actualLevel !== 0) {
            return actualLevel;
        }
    }

    return 0;
}
async function _getMembershipName(level) {
    if (level > 0) {
        return "Level " + level;
    } else {
        return "Member";
    }
}
async function calculateUserLevelMember(userId) {
    //get commission user
    let members = await UserCommissionResource.find({ supervisorId: userId, commisionLevel: 1 });

    let expectLevel = 4;
    let actualLevel = 0;
    if (members && members.length > 0) {
        expectLevel = 4;
        let requireBet = 0;

        if (members.length >= 8) {
            expectLevel = 4;
            requireBet = 1000;
        } else if (members.length >= 6) {
            expectLevel = 3;
            requireBet = 800;
        } else if (members.length >= 4) {
            expectLevel = 2;
            requireBet = 500;
        } else {
            expectLevel = 1;
            requireBet = 200;
        }

        actualLevel = await _calculateActualLevel(expectLevel, requireBet, members);
    }

    return await _getMembershipName(actualLevel);
}
async function generate2FACode(userId) {
    // đây là tên ứng dụng của các bạn, nó sẽ được hiển thị trên app Google Authenticator hoặc Authy sau khi bạn quét mã QR
    const serviceName = process.env.TWO_FA_SERVICE || 'makefamousapp.com';

    let user = await UserResourceAccess.find({ userId: userId });

    if (user && user.length > 0) {
        user = user[0];

        // Thực hiện tạo mã OTP
        let topSecret = "";
        if (user.twoFACode || user.twoFACode !== "") {
            topSecret = user.twoFACode;
        } else {
            topSecret = generateUniqueSecret();
        }

        const otpAuth = generateOTPToken(user.username, serviceName, topSecret)

        const QRCodeImage = await QRCodeFunction.createQRCode(otpAuth)

        if (QRCodeImage) {
            await UserResourceAccess.updateById(user.userId, {
                twoFACode: topSecret,
                twoFAQR: process.env.TWO_FA_SERVICE + `/User/get2FACode?userId=${userId}`
            })
            return QRCodeImage;
        }
    }
    return undefined;
}

/** Kiểm tra mã OTP token có hợp lệ hay không
 * Có 2 method "verify" hoặc "check", các bạn có thể thử dùng một trong 2 tùy thích.
*/
const verify2FACode = (token, topSecret) => {
    console.log(token);
    console.log(topSecret);
    return authenticator.check(token, topSecret)
}

async function retrieveUserTransaction(user) {
    user.totalDeposit = 0;
    user.totalWithdraw = 0;
    user.totalWin = 0;
    user.totalLose = 0;
    user.totalBet = 0;
    user.totalTodayDeposit = 0;
    user.totalTodayWithdraw = 0;
    user.totalTodayBet = 0;
    user.totalTodayWin = 0;
    user.totalTodayLose = 0;

    //Get total statistics
    {
        let totalDeposit = await DepositResource.sumaryPointAmount(undefined, undefined, {
            userId: user.userId, 
            status: DEPOSIT_TRX_STATUS.COMPLETED
        });
        if (totalDeposit && totalDeposit.length > 0 && totalDeposit[0].sumResult !== null) {
          user.totalDeposit = totalDeposit[0].sumResult;
        }
        
        let totalWithdraw = await WithdrawResource.sumaryPointAmount(undefined, undefined, {
            userId: user.userId, 
            status: WITHDRAW_TRX_STATUS.COMPLETED
        });
        if (totalWithdraw && totalWithdraw.length > 0 && totalWithdraw[0].sumResult !== null) {
          user.totalWithdraw = totalWithdraw[0].sumResult;
        }

        let totalWin = await BetRecordResourceAccess.sumaryPointAmount(undefined, undefined, {
            betRecordResult: "win",
            userId: user.userId,
        });
        if (totalWin && totalWin.length > 0 && totalWin[0].sumResult !== null) {
            user.totalWin = totalWin[0].sumResult;
        }
    
        let totalLose = await BetRecordResourceAccess.sumaryPointAmount(undefined, undefined, {
            betRecordResult: "lose",
            userId: user.userId,
            
        });
        if (totalLose && totalLose.length > 0 && totalLose[0].sumResult !== null) {
            user.totalLose = totalLose[0].sumResult;
        }
    
        let totalBet = await BetRecordResourceAccess.sumaryPointAmount(undefined, undefined, {
            userId: user.userId,
        });
        if (totalBet && totalBet.length > 0 && totalBet[0].sumResult !== null) {
            user.totalBet = totalBet[0].sumResult;
        }
    }


    //Get total today statistic
    {
        let today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(5);
        let totalTodayDeposit = await DepositResource.sumaryPointAmount(today, new Date(), {
            userId: user.userId, 
            status: DEPOSIT_TRX_STATUS.COMPLETED
        });
        if (totalTodayDeposit && totalTodayDeposit.length > 0 && totalTodayDeposit[0].sumResult !== null) {
          user.totalTodayDeposit = totalTodayDeposit[0].sumResult;
        }
        
        let totalTodayWithdraw = await WithdrawResource.sumaryPointAmount(today, new Date(), {
            userId: user.userId, 
            status: WITHDRAW_TRX_STATUS.COMPLETED
        });
        if (totalTodayWithdraw && totalTodayWithdraw.length > 0 && totalTodayWithdraw[0].sumResult !== null) {
          user.totalTodayWithdraw = totalTodayWithdraw[0].sumResult;
        }

        let totalTodayLose = await BetRecordResourceAccess.sumaryPointAmount(today, new Date(), {
            betRecordResult: "lose",
            userId: user.userId,
        });
        if (totalTodayLose && totalTodayLose.length > 0 && totalTodayLose[0].sumResult !== null) {
            user.totalTodayLose = totalTodayLose[0].sumResult;
        }
    
        let totalTodayWin = await BetRecordResourceAccess.sumaryPointAmount(today, new Date(), {
            betRecordResult: "win",
            userId: user.userId,
        });
        if (totalTodayWin && totalTodayWin.length > 0 && totalTodayWin[0].sumResult !== null) {
            user.totalTodayWin = totalTodayWin[0].sumResult;
        }
    
        let totalTodayBet = await BetRecordResourceAccess.sumaryPointAmount(today, new Date(), {
            userId: user.userId,
        });
        if (totalTodayBet && totalTodayBet.length > 0 && totalTodayBet[0].sumResult !== null) {
            user.totalTodayBet = totalTodayBet[0].sumResult;
        }
    }
    

    return user;
}

module.exports = {
    verifyUniqueUser,
    verifyCredentials,
    hashPassword,
    unhashPassword,
    retrieveUserDetail,
    changeUserPassword,
    calculateUserLevelMember,
    generate2FACode,
    verify2FACode,
    retrieveUserTransaction
}