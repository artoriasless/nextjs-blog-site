import React from 'react';
import { withRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';

import config from 'config';
import {
    TitleGenerator,
    HeadGenerator,
    Layout,
} from 'components';

const Profile = withRouter(function(props) {
    const seo = props.seo || {};

    return (
        <>
            <TitleGenerator title={ seo.title }/>
            <HeadGenerator seo={ seo }/>
            <Layout>
                <div className="page-profile">
                    <h1>Profile Page</h1>
                    <div>Profile page test</div>
                </div>
            </Layout>
        </>
    );
});

Profile.getInitialProps = async () => {
    const seoRes = await fetch(`${config.domain}/api/util/seo?pageName=profile`);
    const seoResult = await seoRes.json();
    
    const initProps = {
        seo: seoResult.data,
    };

    return initProps;
};

export default Profile;