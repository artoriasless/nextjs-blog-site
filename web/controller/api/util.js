'use strict';

const {
    seoTpl,
} = require('../../lib/constant');

const util = {
    seo: async ctx => {
        const reqData = ctx.query || {};
        const pageType = reqData.page || '';
        const result = {
            success: true,
            message: 'fetch seo data success.',
            data: seoTpl[pageType] || seoTpl.unknown,
        };

        switch (pageType) {
        // additional process
        default:
            // do nothing
        }

        ctx.body = result;
    },
};

module.exports = util;