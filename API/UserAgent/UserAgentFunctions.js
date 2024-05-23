/**
 * Created by A on 7/18/17.
 */
'use strict';

const UserAgentResourceAccess = require("./resourceAccess/UserAgentResourceAccess");

const crypto = require("crypto");

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
    let verifyResult = await UserAgentResourceAccess.find({
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
    let user = await UserAgentResourceAccess.find({ userAgentId: userId });
    if (user && user.length > 0) {
        let foundUser = user[0];

        return foundUser;
    }
    return undefined;
}

async function changeUserPassword(userData, newPassword) {
    let newHashPassword = hashPassword(newPassword);

    let result = await UserAgentResourceAccess.updateById(userData.userId, { password: newHashPassword });

    if (result) {
        return result;
    } else {
        return undefined;
    }
}

module.exports = {
    verifyUniqueUser,
    verifyCredentials,
    hashPassword,
    unhashPassword,
    retrieveUserDetail,
    changeUserPassword,
}