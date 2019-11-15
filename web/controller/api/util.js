'use strict';

const {
    seoTpl,
} = require('../../lib/constant');

const util = {
    seo: async ctx => {
        const reqData = ctx.query || {};
        const pageName = reqData.pageName || '';
        const data = seoTpl[pageName] || seoTpl.default;
        const result = {
            success: true,
            message: 'fetch seo data success.',
            data: '',
        };
        
        switch (pageName) {
        case 'catalogue':
            data.title = data.title.replace(/\[type\]/g, reqData.type || 'all');
            data.title = data.title.replace(/\[page\]/g, reqData.page || '1');
            data.keywords = data.keywords.replace(/\[type\]/g, reqData.type || 'all');
            break;
        default:
            // do nothing
        }

        result.data = data;

        ctx.body = result;
    },
};

module.exports = util;