/**
 * Created by A on 7/18/17.
 */
'use strict'
require('dotenv').config();
const Logger = require('./utils/logging');
const Glue = require('glue');
const Routes = require('./config/routes');
const Manifest = require('./config/manifest');
const AppConfig = require('./config/app');
const Scheduler = require('./schedule');
const MQTTBroker = require('./ThirdParty/MQTTBroker/MQTTBroker');

Glue.compose(Manifest, { relativeTo: __dirname }, (err, server) => {
    if (err) {
        throw err;
    }

    server.start(() => {
        Logger.info('Server running at:', server.info.uri);
        if (process.env.NODE_ENV !== 'dev') {
            Scheduler.startSchedule();
        }

    });
    server.auth.strategy('jwt', 'jwt', {
        key: AppConfig.jwt.secret,
        verifyOptions: { algorithms: ['HS256'] }
    });
    server.route(Routes);

});