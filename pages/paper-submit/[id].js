import React from 'react';
import { withRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';

import config from 'config';
import {
    TitleGenerator,
    HeadGenerator,
    Layout,
} from 'components';

import 'style/pages/paper-submit.scss';

const PaperSubmit = function(props) {
    const seo = props.seo || {};

    return (
        <>
            <TitleGenerator title={ seo.title }/>
            <HeadGenerator seo={ seo }>
                <meta name="robots" content="nofollow"/>
            </HeadGenerator>
            <Layout>
                <div className="page-profile">
                    <h1>Paper Submit Page</h1>
                    <div>Paper Submit page test</div>
                </div>
            </Layout>
        </>
    );
};

PaperSubmit.getInitialProps = async () => {
    const seoRes = await fetch(`${config.domain}/api/util/seo?pageName=paperSubmit`);
    const seoResult = await seoRes.json();
    
    const initProps = {
        seo: seoResult.data,
    };

    return initProps;
};

export default withRouter(PaperSubmit);