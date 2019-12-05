import React from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';

import {
    getParams,
    getFetchUrl,
} from 'lib';
import {
    TitleGenerator,
    HeadGenerator,
    Layout,
    Navbar,
    LoginModal,
    FilterCount,
    PaperCatalogue,
} from 'components';

import 'style/pages/catalogue.scss';

const UI_Catalogue = function(props) {
    const {
        seo,
        filterCount,
        catalogue,
        userInfo,
        filterType,
        filterParam,
    } = props;

    return (
        <>
            <TitleGenerator title={ seo.title }/>
            <HeadGenerator seo={ seo }/>
            <Layout>
                <div className="page-catalogue">
                    <Navbar/>
                    <div className="page-section-body row">
                        <FilterCount filterCount={ filterCount }/>
                        <PaperCatalogue 
                            catalogue={ catalogue }
                            userInfo={ userInfo }
                            filterType={ filterType }
                            filterParam={ filterParam }
                        />
                    </div>
                </div>
            </Layout>
            <LoginModal/>
        </>
    );
};
const mapState2Props = (state, props) => Object.assign({}, state, props);
const mapDispatch2Props = () => ({});
let Catalogue;

UI_Catalogue.propTypes = {
    seo: PropTypes.object,
    filterCount: PropTypes.object,
    catalogue: PropTypes.object,
    userInfo: PropTypes.object,
    filterType: PropTypes.string,
    filterParam: PropTypes.string,
};
Catalogue = connect(
    mapState2Props,
    mapDispatch2Props,
)(UI_Catalogue);
Catalogue.getInitialProps = async ctx => {
    const {
        type,
        page,
    } = getParams(ctx);
    const filterType = type.split('>')[0] || 'unknown';
    const filterParam = type.split('>')[1] || 'unknown';

    const seoData = {
        pageName: 'catalogue',
        filterType,
        filterParam,
        page,
    };
    const seoReq = getFetchUrl('util.seo', seoData);
    const seoRes = seoReq && await fetch(seoReq);
    const seoResult = seoRes && await seoRes.json();

    const catalogueData = {
        filterType,
        filterParam,
        page,
    };
    const catalogueReq = getFetchUrl('catalogue.page', catalogueData);
    const catalogueRes = catalogueReq && await fetch(catalogueReq);
    const catalogueResult = catalogueRes && await catalogueRes.json();

    const filterCountData = {
        filterType: 'all',
    };
    const filterCountReq = getFetchUrl('paper.filterCount', filterCountData);
    const filterCountRes = filterCountReq && await fetch(filterCountReq);
    const filterCountResult = filterCountRes && await filterCountRes.json();
    
    const initProps = {
        seo: seoResult.data,
        catalogue: catalogueResult.data,
        filterCount: filterCountResult.data,

        filterType,
        filterParam,
    };

    return initProps;
};

export default withRouter(Catalogue);