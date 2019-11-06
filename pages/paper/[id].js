import React from 'react';
import { withRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';

import config from 'config';
import {
    TitleGenerator,
    HeadGenerator,
    Layout,
} from 'components';

const Paper = withRouter(function(props) {
    const seo = props.seo || {};

    return (
        <>
            <TitleGenerator title={ seo.title }/>
            <HeadGenerator seo={ seo }/>
            <Layout>
                <h1>Paper Page</h1>
                <div>Paper page test</div>
            </Layout>
        </>
    );
});

Paper.getInitialProps = async () => {
    const seoParam = {
        page: 'paper',
    };
    const seoRes = await fetch(`${config.domain}/api/util/seo`, {
        method: 'POST',
        body: JSON.stringify(seoParam),
    });
    const seoResult = await seoRes.json();
    
    const initProps = {
        seo: seoResult.data,
    };

    return initProps;
};

export default Paper;