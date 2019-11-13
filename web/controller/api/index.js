'use strict';

const koaCors = require('koa2-cors');

const config = require('../../../config');

const user = require('./user');
const util = require('./util');

const GET = 'GET';
const POST = 'POST';
const cors = config.dev;
const confiList = [
    // routerUrl, isCors, type, controllerFunc
    
    // User
    ['/api/user/default', cors, GET, user.getUserDefault],
    ['/api/user/login',cors, POST, user.login],
    ['/api/user/logout', cors, POST, user.logout],
    ['/api/user/register', cors, POST, user.register],
    ['/api/user/activate', cors, POST, user.activate],
    ['/api/user/update-info', cors, POST, user.updateInfo],
    ['/api/user/update-pwd', cors, POST, user.updatePwd],
    ['/api/user/reset-pwd', cors, POST, user.resetPwd],
    ['/api/user/send-activate-mail', cors, POST, user.sendActivateMail],

    // Util
    ['/api/util/seo', cors, GET, util.seo],
];

const api = (router, app) => { // eslint-disable-line
    // used for api request
    confiList.forEach(confItem => {
        const [
            routerUrl, isCors, type, controllerFunc,
        ] = confItem;

        if (isCors) {
            switch(type) {
            case GET:
                router.get(routerUrl, koaCors(), controllerFunc);
                break;
            case POST:
                router.post(routerUrl, koaCors(), controllerFunc);
                break;
            default:
                // do nothing
            }
        } else {
            switch(type) {
            case GET:
                router.get(routerUrl, controllerFunc);
                break;
            case POST:
                router.post(routerUrl, controllerFunc);
                break;
            default:
                // do nothing
            }
        }
    });

    return router;
};

module.exports = api;