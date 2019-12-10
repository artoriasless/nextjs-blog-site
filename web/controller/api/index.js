'use strict';

const koaCors = require('koa2-cors');

const config = require('../../../config');

const user = require('./user');
const catalogue = require('./catalogue');
const paper = require('./paper');
const reply = require('./reply');
const message = require('./message');
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
    ['/api/user/update-avatar', cors, POST, user.updateAvatar],
    ['/api/user/reset-pwd', cors, POST, user.resetPwd],
    ['/api/user/send-activate-mail', cors, POST, user.sendActivateMail],

    // Catalogue
    ['/api/catalogue/page', cors, GET, catalogue.page],

    // Paper
    ['/api/paper/filter-count', cors, GET, paper.filterCount],
    ['/api/paper/:paperId', cors, GET, paper.findOne],
    ['/api/paper/upload-material', cors, POST, paper.uploadMaterial],
    ['/api/paper/create', cors, POST, paper.create],
    ['/api/paper/:paperId/update', cors, POST, paper.update],

    // Reply
    ['/api/reply', cors, GET, reply.findMany],
    ['/api/reply/create', cors, POST, reply.create],
    ['/api/reply/:replyId/update', cors, POST, reply.update],
    ['/api/reply/:replyId/delete', cors, POST, reply.delete],

    // Message
    ['/api/message/page', cors, GET, message.page],

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