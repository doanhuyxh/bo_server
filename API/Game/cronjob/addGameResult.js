/**
 * Created by A on 7/18/17.
 */
"use strict";
const GameFunctions = require("../GameFunctions");
const { GAME_RECORD_STATUS } = require("../GameRecordsConstant");
const {
    BET_UNIT,
    BET_TYPE,
    BET_STATUS,
} = require("../../BetRecords/BetRecordsConstant");
const BetRecordFunction = require("../../BetRecords/BetRecordsFunctions");
const BetRecordResource = require("../../BetRecords/resourceAccess/BetRecordsResourceAccess");
const GameRecordsResourceAccess = require("../resourceAccess/GameRecordsResourceAccess");
const CryptoFunction = require("../../CryptoCurrency/CryptoCurrencyFunctions");
const SystemStatus = require("../../Maintain/MaintainFunctions").systemStatus;

function downSection(thoiGian) {
    let [gio, phut, giay] = thoiGian.split(':');
    const originalFormat = (parseInt(phut, 10) < 10 ? phut : ('0' + parseInt(phut, 10)));

    phut = (parseInt(phut, 10) > 0) ? ((parseInt(phut, 10) - 1)) : ((parseInt(gio, 10) > 0) ? 59 : 23);
    giay = "00";
    phut = phut;

    return `${gio}:${phut}:${giay}`;
}



function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//make random price with variant 0.1%
function makeRandomPrice(currentPrice) {
    let price = currentPrice * 10000;
    let onePercent = (price * 0.1) / 100;
    let newPrice = ((price + getRandomInt(onePercent)) / 10000).toFixed(4);
    return newPrice;
}

async function checkBetRecordResult(gameRecord) {

    if (gameRecord.gameRecordTypeUp === 0) {
        await BetRecordFunction.loseBetRecord(
            BET_TYPE.UP,
            gameRecord.gameRecordUnit,
            gameRecord.gameRecordSection,
            gameRecord.gameRecordPrice
        );
    } else {
        await BetRecordFunction.winBetRecord(
            BET_TYPE.UP,
            gameRecord.gameRecordUnit,
            gameRecord.gameRecordSection,
            gameRecord.gameRecordPrice
        );
    }

    if (gameRecord.gameRecordTypeDown === 0) {
        await BetRecordFunction.loseBetRecord(
            BET_TYPE.DOWN,
            gameRecord.gameRecordUnit,
            gameRecord.gameRecordSection,
            gameRecord.gameRecordPrice
        );
    } else {
        await BetRecordFunction.winBetRecord(
            BET_TYPE.DOWN,
            gameRecord.gameRecordUnit,
            gameRecord.gameRecordSection,
            gameRecord.gameRecordPrice
        );
    }

    if (gameRecord.gameRecordTypeOdd === 0) {
        await BetRecordFunction.loseBetRecord(
            BET_TYPE.ODD,
            gameRecord.gameRecordUnit,
            gameRecord.gameRecordSection,
            gameRecord.gameRecordPrice
        );
    } else {
        await BetRecordFunction.winBetRecord(
            BET_TYPE.ODD,
            gameRecord.gameRecordUnit,
            gameRecord.gameRecordSection,
            gameRecord.gameRecordPrice
        );
    }

    if (gameRecord.gameRecordTypeEven === 0) {
        await BetRecordFunction.loseBetRecord(
            BET_TYPE.EVEN,
            gameRecord.gameRecordUnit,
            gameRecord.gameRecordSection,
            gameRecord.gameRecordPrice
        );
    } else {
        await BetRecordFunction.winBetRecord(
            BET_TYPE.EVEN,
            gameRecord.gameRecordUnit,
            gameRecord.gameRecordSection,
            gameRecord.gameRecordPrice
        );
    }
}

let UpOddIdx = 0;
let UpEvenIdx = 0;
let DownOddIdx = 0;
let DownEvenIdx = 0;
function autoBalancePrice(price, betUp, betDown, betOdd, betEven) {
    let balancePrice = price + "";

    let balancePriceArr = balancePrice.split("");
    balancePriceArr.pop();

    if (betUp && betOdd) {
        if (UpOddIdx === 0) {
            balancePriceArr.push("5");
        } else if (UpOddIdx === 1) {
            balancePriceArr.push("7");
        } else if (UpOddIdx === 2) {
            balancePriceArr.push("9");
        }
        UpOddIdx++;
        if (UpOddIdx > 2) {
            UpOddIdx = 0;
        }
    } else if (betUp && betEven) {
        if (UpEvenIdx === 0) {
            balancePriceArr.push("6");
        } else if (UpEvenIdx === 1) {
            balancePriceArr.push("8");
        } else if (UpEvenIdx === 2) {
            balancePriceArr.push("6");
        }
        UpEvenIdx++;
        if (UpEvenIdx > 2) {
            UpEvenIdx = 0;
        }
    } else if (betDown && betOdd) {
        if (DownOddIdx === 0) {
            balancePriceArr.push("1");
        } else if (DownOddIdx === 1) {
            balancePriceArr.push("3");
        } else if (DownOddIdx === 2) {
            balancePriceArr.push("1");
        }
        DownOddIdx++;
        if (DownOddIdx > 2) {
            DownOddIdx = 0;
        }
    } else if (betDown && betEven) {
        if (DownEvenIdx === 0) {
            balancePriceArr.push("0");
        } else if (DownEvenIdx === 1) {
            balancePriceArr.push("2");
        } else if (DownEvenIdx === 2) {
            balancePriceArr.push("4");
        }
        DownEvenIdx++;
        if (DownEvenIdx > 2) {
            DownEvenIdx = 0;
        }
    }

    balancePrice = balancePriceArr.join("");

    return (balancePrice * 1).toFixed(4);
}

async function makeAutoWinPrice(
    gameRecordPrice,
    gameRecordSection,
    gameRecordUnit
) {
    let autoWinPrice = gameRecordPrice;
    let upTotal = await BetRecordResource.sum("betRecordAmountIn", {
        betRecordType: "BetUp",
        betRecordSection: gameRecordSection,
        betRecordUnit: gameRecordUnit,
        betRecordStatus: BET_STATUS.NEW,
    });
    if (upTotal && upTotal.length > 0) {
        upTotal = upTotal[0].sumResult;
    }

    let downTotal = await BetRecordResource.sum("betRecordAmountIn", {
        betRecordType: "BetDown",
        betRecordSection: gameRecordSection,
        betRecordUnit: gameRecordUnit,
        betRecordStatus: BET_STATUS.NEW,
    });
    if (downTotal && downTotal.length > 0) {
        downTotal = downTotal[0].sumResult;
    }

    let oddTotal = await BetRecordResource.sum("betRecordAmountIn", {
        betRecordType: "BetOdd",
        betRecordSection: gameRecordSection,
        betRecordUnit: gameRecordUnit,
        betRecordStatus: BET_STATUS.NEW,
    });
    if (oddTotal && oddTotal.length > 0) {
        oddTotal = oddTotal[0].sumResult;
    }

    let evenTotal = await BetRecordResource.sum("betRecordAmountIn", {
        betRecordType: "BetEven",
        betRecordSection: gameRecordSection,
        betRecordUnit: gameRecordUnit,
        betRecordStatus: BET_STATUS.NEW,
    });
    if (evenTotal && evenTotal.length > 0) {
        evenTotal = evenTotal[0].sumResult;
    }

    //if they are equal, then random choose 1 result
    if (upTotal === downTotal) {
        upTotal = makeRandomPrice(autoWinPrice);
        downTotal = makeRandomPrice(autoWinPrice);
    }

    //if they are equal, then random choose 1 result
    if (oddTotal === evenTotal) {
        oddTotal = makeRandomPrice(autoWinPrice);
        evenTotal = makeRandomPrice(autoWinPrice);
    }

    autoWinPrice = autoBalancePrice(
        autoWinPrice,
        upTotal < downTotal,
        downTotal < upTotal,
        oddTotal < evenTotal,
        evenTotal < oddTotal
    );

    return (autoWinPrice * 1).toFixed(4);
}

async function addNewGameResult(cryptoCurrency) {
    console.log(`addNewGameResult ${cryptoCurrency}`);
    if (SystemStatus.liveGame === false) {
        console.log(`--------GAME STOP----- ${new Date()}`);
        return;
    }

    let priceToUSD = await CryptoFunction.getPriceByName(cryptoCurrency);

    if (priceToUSD * 1000000 <= 0.0) {
        console.log("********** ERROR PRICE **********");

        if (cryptoCurrency == "ETH") {
            priceToUSD = 1656.85;
        } else if (cryptoCurrency == "BTC") {
            priceToUSD = 27391;
        } else if (cryptoCurrency == "XRP") {
            priceToUSD = 0.14918;
        } else if (cryptoCurrency == "ADA") {
            priceToUSD = 0.261251;
        } else if (cryptoCurrency == "BNB") {
            priceToUSD = 210.77;
        } else if (cryptoCurrency == "DOGE") {
            priceToUSD = 4.09;
        } else if (cryptoCurrency == "LTC") {
            priceToUSD = 66.77;
        }

        console.log("********** ERROR PRICE **********");
    }

    //get latest Game Section
    let currentTime = new Date();
    let gameRecordSection =
        currentTime.getHours() + ":" + (currentTime.getMinutes() * 1 + ":00");
    let gameRecordPrice = makeRandomPrice(priceToUSD);
    let gameRecordUnit = BET_UNIT[cryptoCurrency];
    if (!gameRecordUnit) {
        console.log("********ERROR gameRecordUnit wrong ********");
        return;
    }

    let existedRecord = await GameRecordsResourceAccess.find({
        gameRecordSection: gameRecordSection,
        gameRecordUnit: gameRecordUnit,
    });

    //if it was predefined by admin, then update status to display it
    if (existedRecord && existedRecord.length > 0) {
        existedRecord = existedRecord[0];
        let recordId = existedRecord.gameRecordId;
        delete existedRecord.gameRecordId;
        existedRecord.gameRecordStatus = GAME_RECORD_STATUS.COMPLETED;
        if (SystemStatus.autobalance === true) {
            gameRecordPrice = autoBalancePrice(
                gameRecordPrice,
                existedRecord.gameRecordTypeUp,
                existedRecord.gameRecordTypeDown,
                existedRecord.gameRecordTypeOdd,
                existedRecord.gameRecordTypeEven
            );
        }

        (existedRecord.gameRecordPrice = gameRecordPrice),
            await GameRecordsResourceAccess.updateById(recordId, existedRecord);

        let existedRecord2 = await GameRecordsResourceAccess.find({
            gameRecordSection: (currentTime.getHours() + ":" + ((currentTime.getMinutes() * 1 - 1) + ":00")),
            gameRecordUnit: gameRecordUnit,
        });
        checkBetRecordResult(existedRecord2[0]);
    } else {
        if (SystemStatus.autobalance === true) {
            gameRecordPrice = await makeAutoWinPrice(
                gameRecordPrice,
                gameRecordSection,
                gameRecordUnit
            );
        }

        //else add new records
        let gameRecordType = GameFunctions.checkGameRecordResult(gameRecordPrice);

        let newRecordData = {
            gameRecordSection: gameRecordSection,
            gameRecordPrice: gameRecordPrice,
            gameRecordUnit: gameRecordUnit,
            gameRecordTypeUp: gameRecordType.gameRecordTypeUp,
            gameRecordTypeDown: gameRecordType.gameRecordTypeDown,
            gameRecordTypeOdd: gameRecordType.gameRecordTypeOdd,
            gameRecordTypeEven: gameRecordType.gameRecordTypeEven,
            gameRecordStatus: GAME_RECORD_STATUS.COMPLETED,
            gameRecordNote: "Auto tạo",
        };


        let newRecord = await GameRecordsResourceAccess.insert(newRecordData);

        let existedRecord2 = await GameRecordsResourceAccess.find({
            gameRecordSection: (currentTime.getHours() + ":" + ((currentTime.getMinutes() * 1 -1) + ":00")),
            gameRecordUnit: gameRecordUnit,
        });
        checkBetRecordResult(existedRecord2[0]);
        return newRecord;
    }
}

async function runAllTask() {
    await addNewGameResult("ETH");
    await addNewGameResult("BTC");
}

// runAllTask();

module.exports = {
    addNewGameResult,
    runAllTask,
};
