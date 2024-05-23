/**
 * Created by A on 7/18/17.
 */
"use strict";
const Manager = require("../manager/CryptoCurrencyManager");
const Joi = require("joi");
const Response = require("../../Common/route/response").setup(Manager);
const CommonFunctions = require('../../Common/CommonFunctions');

module.exports = {
  getPriceByName: {
    tags: ["api", "CryptoCurrency"],
    description: "get current USD price of currency",
    pre: [
      { method: CommonFunctions.verifyToken },
    ],
    auth: {
      strategy: 'jwt',
    },
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).unknown(),
      payload: Joi.object({
        currencyCode: Joi.string().default("ETH").required()
      })
    },
    handler: function (req, res) {
      Response(req, res, "getPriceByName");
    }
  },
};
