import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';

import config from 'config';
import {
    TitleGenerator,
    HeadGenerator,
    Layout,
} from 'components';

const Home = function(props) {
    const seo = props.seo || {};

    return (
        <>
            <TitleGenerator title={ seo.title }/>
            <HeadGenerator seo={ seo }/>
            <Layout>
                <h1>Home Page</h1>
                <div>home page test</div>
            </Layout>
        </>
    );
};

Home.propTypes = {
    seo: PropTypes.object,
};
Home.getInitialProps = async () => {
    const seoParam = {
        page: 'home',
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

export default Home;