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
                <div className="page-paper">
                    <h1>Paper Page</h1>
                    <div>Paper page test</div>
                </div>
            </Layout>
        </>
    );
});

Paper.getInitialProps = async () => {
    const seoRes = await fetch(`${config.domain}/api/util/seo?pageName=paper`);
    const seoResult = await seoRes.json();
    
    const initProps = {
        seo: seoResult.data,
    };

    return initProps;
};

export default Paper;