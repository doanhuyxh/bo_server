/**
 * Created by A on 7/18/17.
 */
'use strict';

const fs = require('fs');
const AppConfig = require('../config/app');
const tlsConfig = {
    key: fs.readFileSync( `${process.env.KEY_PATH}openssl/private.key` ),
    cert: fs.readFileSync( `${process.env.KEY_PATH}openssl/certificate.crt` )
};


const manifest = {
    server: {
        
    },
    connections: [
        {
            router: {
                isCaseSensitive: false,
                stripTrailingSlash: false
            },
            port: process.env.PORT || 5001,
            routes: {
                cors: {
                    "origin": ["*"],
                    "headers": ['Authorization', 'Content-Type'],
                    "credentials": false,
                }
            },

            address: "0.0.0.0",
            //tls: tlsConfig
        }
    ],
    registrations: [{
        plugin: {
            register: 'hapi-auth-jwt',
            options: AppConfig.jwt.options
        }
    }]
};

if (AppConfig.documentation.enable) {
    manifest.registrations.push(
        {
            plugin: {
                register: 'hapi-swagger',
                options: AppConfig.documentation.options
            }
        }
    );
    manifest.registrations.push(
        {
            plugin: {
                register: 'hapi-swagger',
                options: {
                    origins: ['*'], // Replace with the origins you want to allow
                    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Replace with the allowed methods
                    headers: ['Authorization', 'Content-Type'], // Replace with the allowed headers
                    credentials: false,
                }
            }
        }
    );

    if (AppConfig.documentation.options.documentationPage || AppConfig.documentation.options.swaggerUI) {
        manifest.registrations.push(
            {
                plugin: {
                    register: 'inert',
                    options: {}
                }
            },
            {
                plugin: {
                    register: 'vision',
                    options: {}
                }
            }
        );
    }
}

if (AppConfig.logging.console.enable || AppConfig.logging.loggly.enable) {
    const loggingPlugins = {
        plugin: {
            register: 'good',
            options: {
                reporters: {}
            }
        }
    };

    if (AppConfig.logging.console.enable) {
        loggingPlugins.plugin.options.reporters.consoleReporter = [
            {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: AppConfig.logging.console.levels
            },
            {
                module: 'good-console'
            }, 'stdout'
        ]
    }

    if (AppConfig.logging.loggly.enable) {
        loggingPlugins.plugin.options.reporters.logglyReporter = [
            {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: AppConfig.logging.loggly.levels
            },
            {
                module: 'good-loggly',
                args: [
                    {
                        token: AppConfig.logging.loggly.token,
                        subdomain: AppConfig.logging.loggly.subdomain,
                        tags: AppConfig.logging.loggly.tags,
                        name: AppConfig.logging.loggly.name,
                        hostname: AppConfig.logging.loggly.hostname,
                        threshold: AppConfig.logging.loggly.threshold,
                        maxDelay: AppConfig.logging.loggly.maxDelay
                    }
                ]
            }
        ]
    }

    manifest.registrations.push(loggingPlugins);
}


module.exports = manifest;
