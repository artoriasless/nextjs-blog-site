import React from 'react';
import { withRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';

import config from 'config';
import {
    TitleGenerator,
    HeadGenerator,
    Layout,
} from 'components';

const Catalogue = withRouter(function(props) {
    const seo = props.seo || {};

    return (
        <>
            <TitleGenerator title={ seo.title }/>
            <HeadGenerator seo={ seo }/>
            <Layout>
                <h1>Catalogue Page</h1>
                <div>Catalogue page test</div>
            </Layout>
        </>
    );
});

Catalogue.getInitialProps = async () => {
    const seoParam = {
        page: 'catalogue',
    };
    const seoRes = await fetch(`${config.domain}/api/util/seo?page=catalogue`, {
        method: 'POST',
        body: JSON.stringify(seoParam),
    });
    const seoResult = await seoRes.json();
    
    const initProps = {
        seo: seoResult.data,
    };

    return initProps;
};

export default Catalogue;