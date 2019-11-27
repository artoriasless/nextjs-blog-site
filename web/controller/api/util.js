'use strict';

const {
    seoTpl,
} = require('../../lib/constant');

const copyObj = obj => JSON.parse(JSON.stringify(obj));

const util = {
    seo: async ctx => {
        const reqData = ctx.query || {};
        const pageName = reqData.pageName || '';
        const data = copyObj(seoTpl[pageName] || seoTpl.default);
        const result = {
            success: true,
            message: 'fetch seo data success.',
            data: '',
        };
        let type;   // for catalogue
        
        switch (pageName) {
        case 'catalogue':
            type = reqData.filterType;
            type += type === 'all' ? '' : `>${reqData.filterParam}`;
            data.title = data.title.replace(/\[type\]/g, type);
            data.title = data.title.replace(/\[page\]/g, reqData.page || '1');
            data.keywords = data.keywords.replace(/\[type\]/g, type);
            break;
        default:
            // do nothing
        }

        result.data = data;

        ctx.body = result;
    },
};

module.exports = util;