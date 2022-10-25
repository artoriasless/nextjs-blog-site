import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import config from 'config';

const CommonHeadGenerator = function(props) {
    const {
        seo,
        children,
    } = props;
    // 使用远程图标会导致无法显示，使用服务器上的 ico 图标
    const favUrl = '/static/favicon.ico';
    const assetPrefix = config.dev ? '' : config.ossPublic.assetPrefix;

    return (
        <Head>
            <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
            <link rel="icon" type="image/x-icon" href={ favUrl }/>
            <link rel="shortcut icon" type="image/x-icon" href={ favUrl }/>
            <link rel="stylesheet" href={ `${assetPrefix}/static/font-awesome/css/font-awesome.min.css` }/>

            <meta name="Description" content={ seo.description }></meta>
            <meta property="og:title" content={ seo.title }></meta>
            <meta property="og:description" content={ seo.description }></meta>
            <meta name="keywords" content={ seo.keywords }></meta>

            { children }
        </Head>
    );
};

CommonHeadGenerator.propTypes = {
    seo: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
};

export default CommonHeadGenerator;
