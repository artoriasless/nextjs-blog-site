'use strict';

const {
    seoTpl,
} = require('../../lib/constant');

const util = {
    seo: async ctx => {
        const pageType = ctx.query.page || '';
        const result = {
            success: true,
            message: 'fetch seo data success.',
            data: {},
        };

        switch (pageType) {
        default:
            result.data = seoTpl.unknown;
        }

        ctx.body = result;
    },
};

module.exports = util;