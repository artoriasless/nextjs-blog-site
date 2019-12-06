import React from 'react';
import { withRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';

import config from 'config';
import {
    TitleGenerator,
    HeadGenerator,
    Layout,
} from 'components';

const activate = withRouter(function(props) {
    const seo = props.seo || {};

    return (
        <>
            <TitleGenerator title={ seo.title }/>
            <HeadGenerator seo={ seo }>
                <meta name="robots" content="nofollow"/>
            </HeadGenerator>
            <Layout>
                <div className="page-activate">
                    <h1>activate Page</h1>
                    <div>activate page test</div>
                </div>
            </Layout>
        </>
    );
});

activate.getInitialProps = async () => {
    const seoRes = await fetch(`${config.domain}/api/util/seo?page=activate`);
    const seoResult = await seoRes.json();
    
    const initProps = {
        seo: seoResult.data,
    };

    return initProps;
};

export default activate;