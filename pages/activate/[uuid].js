import React, { useEffect, } from 'react';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';

import {
    getFetchUrl,
    getParams,
    ajaxAction,
    stanAlert,
} from 'lib';
import {
    TitleGenerator,
    HeadGenerator,
    Layout,
} from 'components';

import 'style/pages/activate.scss';

const Activate = function(props) {
    const {
        uuid,
        seo,
    } = props;
    const activateAccount = () => {
        const jsonData = {
            uuid,
        };
        const successFunc = result => {
            if (result.success) {
                stanAlert({
                    type: 'success',
                    content: result.message,
                    textAlign: 'center',
                    shownExpires: 1,
                });
            } else {
                stanAlert({
                    title: 'Warning!',
                    content: result.message,
                });
            }

            setTimeout(() => {
                stanAlert({
                    type: 'info',
                    content: 'ready to home page...',
                    textAlign: 'center',
                    shownExpires: 1,
                });

                setTimeout(() => {
                    location.href='/';
                }, 1000);
            }, 1500);
        };
        const failFunc = err => {
            setTimeout(() => {
                stanAlert({
                    title: 'Warning!',
                    content: 'connect to server failed, please try again later...',
                });
                console.info(err);  //  eslint-disable-line
            }, 1000);
        };

        ajaxAction('user.activate', jsonData, successFunc, failFunc);
    };

    useEffect(() => {
        activateAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <TitleGenerator title={ seo.title }/>
            <HeadGenerator seo={ seo }>
                <meta name="robots" content="nofollow"/>
            </HeadGenerator>
            <Layout>
                <div className="stan-loading-container">
                    <div className="stan-loading-content"></div>
                </div>
            </Layout>
        </>
    );
};

Activate.propTypes = {
    uuid: PropTypes.string,
    seo: PropTypes.object,
};
Activate.getInitialProps = async ctx => {
    const {
        uuid,
    } = getParams(ctx);

    const seoData = {
        pageName: 'activate',
    };
    const seoReq = getFetchUrl('util.seo', seoData);
    const seoRes = seoReq && await fetch(seoReq);
    const seoResult = seoRes && await seoRes.json();
    
    const initProps = {
        uuid,
        seo: seoResult.data,
    };

    return initProps;
};

export default withRouter(Activate);