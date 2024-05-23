/**
 * Created by A on 7/18/17.
 */
'use strict';

const BetRecordsResource = require('./resourceAccess/BetRecordsResourceAccess');
const { BET_STATUS } = require('./BetRecordsConstant');
const WalletResource = require('../Wallet/resourceAccess/WalletResourceAccess');
const MQTTFunction = require('../../ThirdParty/MQTTBroker/MQTTBroker');
const User = require("../User/resourceAccess/UserResourceAccess")

function getCurrentBetSection() {
    let currentTime = new Date();
    return currentTime.getHours() + ":" + ((currentTime.getMinutes() * 1) + ":00");
}

function downSection(thoiGian) {
    let [gio, phut, giay] = thoiGian.split(':');
    const originalFormat = (parseInt(phut, 10) < 10 ? phut : ('0' + parseInt(phut, 10)));

    phut = (parseInt(phut, 10) > 0) ? ((parseInt(phut, 10) - 1)) : ((parseInt(gio, 10) > 0) ? 59 : 23);
    giay = "00";
    phut = phut;

    return `${gio}:${phut}:${giay}`;
}


async function _placeNewBet(userId, betRecordAmountIn, betRecordType, betRecordUnit, referUserId) {
    let newBetData = {
        userId: userId,
        betRecordSection: getCurrentBetSection(),
        betRecordAmountIn: betRecordAmountIn,
        betRecordType: betRecordType,
        betRecordUnit: betRecordUnit,
        
    }
    if (referUserId && referUserId > 0) {
        newBetData.referId = referUserId;
    }
    let newBetResult = await BetRecordsResource.insert(newBetData);
    console.log("chen ket qua ", newBetData.betRecordSection)
    return newBetResult;
}

async function _updateCurrentBet(currentBetRecord, betRecordAmountIn, betRecordType, betRecordUnit) {
    let newBetData = {
        betRecordSection: currentBetRecord.betRecordSection,
        betRecordAmountIn: betRecordAmountIn,
        betRecordType: betRecordType,
    }

    let newBetResult = await BetRecordsResource.updateById(currentBetRecord.betRecordId, newBetData);
    return newBetResult;
}

async function placeUserBet(userId, betRecordAmountIn, betRecordType, betRecordUnit) {
    if (!userId || userId < 1) {
        console.error("null userid can not place bet");
        return undefined;
    }

    let wallet = await WalletResource.find({ userId: userId });
    if (!wallet || wallet.length < 1) {
        console.error("null wallet can not place bet");
        return undefined;
    }

    wallet = wallet[0];

    if (wallet.balance >= betRecordAmountIn) {
        await WalletResource.incrementBalance(wallet.walletId, betRecordAmountIn * -1);
    }
    // let betRecord = await BetRecordsResource.find({
    //   userId: userId,
    //   betRecordSection: getCurrentBetSection(),
    //   betRecordUnit: betRecordUnit,
    //   betRecordType: betRecordType,
    // });

    // if(!betRecord || betRecord.length < 1) {
    return await _placeNewBet(userId, betRecordAmountIn, betRecordType, betRecordUnit, profit);
    // } else {
    //   betRecord = betRecord[0];
    //   return await _updateCurrentBet(betRecord, betRecordAmountIn, betRecordType);
    // }
}

async function loseBetRecord(betRecordType, betRecordUnit, betRecordSection, gameCurrentPrice) {
    console.log(`loseBetRecord ${betRecordType} ${betRecordUnit} ${betRecordSection} - ${gameCurrentPrice}`)
    let failResult = {
        betRecordResult: "lose",
        betRecordStatus: BET_STATUS.COMPLETED,
    };
    let filter = {
        betRecordType: betRecordType,
        betRecordUnit: betRecordUnit,
        betRecordSection: betRecordSection,
        betRecordStatus: BET_STATUS.NEW
    }
    let failRecords = await BetRecordsResource.findAllTodayNewBet(filter);

    for (let i = 0; i < failRecords.length; i++) {
        const record = failRecords[i];

        // let user2 = await WalletResource.find({userId:record.userId})
        // console.log("user2", user2)
        //let userup = await WalletResource.incrementBalance(3, 12000000)

        MQTTFunction.publishJson(`USER_${record.userId}`, {
            when: new Date() - 1,
            amount: record.betRecordAmountIn,
            result: "lose",
            value: gameCurrentPrice
        })
    }
    await BetRecordsResource.updateAllBet(failResult, filter);
}

async function winBetRecord(betRecordType, betRecordUnit, betRecordSection, gameCurrentPrice) {
    console.log(`winBetRecord ${betRecordType} ${betRecordUnit} ${betRecordSection} - ${gameCurrentPrice}`)
    let winResult = {
        betRecordResult: "win",
        betRecordStatus: BET_STATUS.COMPLETED,
    };

    let filter = {
        betRecordType: betRecordType,
        betRecordUnit: betRecordUnit,
        betRecordSection: betRecordSection,
        betRecordStatus: BET_STATUS.NEW,
    }

    let winRate = 90 / 100; //90% bet money

    let betRecords = await BetRecordsResource.findAllTodayNewBet(filter);
    console.log(`betRecords: ${betRecords.length}`);
    if (betRecords && betRecords.length > 0) {
        for (let i = 0; i < betRecords.length; i++) {
            const betRecord = betRecords[i];
            let winPoint = betRecord.betRecordAmountIn + betRecord.betRecordAmountIn * winRate;

            let newRecordDate = {
                ...winResult,
                betRecordWin: winPoint,
            }
            //Update bet record result to WIN
            await BetRecordsResource.updateById(betRecord.betRecordId, newRecordDate);

            //Pay win money for user
            let wallet = await WalletResource.find({ userId: betRecord.userId });
            if (!wallet || wallet.length < 1) {
                console.error("null wallet can not place bet");
                return undefined;
            }
            // can su ly cong tien o day
            wallet = wallet[0];
            await WalletResource.incrementBalance(wallet.walletId, winPoint);
            MQTTFunction.publishJson(`USER_${betRecord.userId}`, {
                when: new Date() - 1,
                amount: winPoint,
                result: "win",
                value: gameCurrentPrice
            })
        }
    }
}

module.exports = {
    placeUserBet,
    getCurrentBetSection,
    winBetRecord,
    loseBetRecord
}