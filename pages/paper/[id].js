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
    PaperDetail,
    PaperReply,
} from 'components';

import 'style/pages/paper.scss';

const UI_Paper = function(props) {
    const {
        seo,
        filterCount,
        paper,
        replyList,
        paperId,
        userInfo,
    } = props;

    return (
        <>
            <TitleGenerator title={ seo.title }/>
            <HeadGenerator seo={ seo }/>
            <Layout>
                <div className="page-paper">
                    <Navbar/>
                    <div className="page-section-body row">
                        <FilterCount filterCount={ filterCount }/>
                        <div className="paper-container col-xs-12 col-md-8 col-lg-9">
                            <div className="paper-content">
                                <PaperDetail paper={ paper } userInfo={ userInfo }/>
                                <hr/>
                                <PaperReply
                                    paperId={ paperId }
                                    replyList={ replyList }
                                    userInfo={ userInfo }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
            <LoginModal/>
        </>
    );
};
const mapState2Props = (state, props) => Object.assign({}, state, props);
const mapDispatch2Props = () => ({});
let Paper;

UI_Paper.propTypes = {
    seo: PropTypes.object,
    filterCount: PropTypes.object,
    paper: PropTypes.object,
    replyList: PropTypes.array,
    paperId: PropTypes.number,
    userInfo: PropTypes.object,
};
Paper = connect(
    mapState2Props,
    mapDispatch2Props,
)(UI_Paper);
Paper.getInitialProps = async ctx => {
    const {
        id,
    } = getParams(ctx);

    const paperData = {
        paperId: id,
    };
    const paperReq = getFetchUrl('paper.detail', paperData);
    const paperRes = paperReq && await fetch(paperReq);
    const paperResult = paperRes && await paperRes.json();
    const paper = paperResult.data || {};

    const seoData = {
        pageName: 'paper',
        title: encodeURIComponent(paper.title),
        month: encodeURIComponent(paper.monthTag),
        tag: encodeURIComponent(paper.tag),
        subtag: encodeURIComponent(paper.subtag),
        desc: paper.brief ? encodeURIComponent(paper.brief) : '',
    };
    const seoReq = getFetchUrl('util.seo', seoData);
    const seoRes = seoReq && await fetch(seoReq);
    const seoResult = seoRes && await seoRes.json();

    const filterCountData = {
        filterType: 'all',
    };
    const filterCountReq = getFetchUrl('paper.filterCount', filterCountData);
    const filterCountRes = filterCountReq && await fetch(filterCountReq);
    const filterCountResult = filterCountRes && await filterCountRes.json();

    const replyData = {
        paperId: id,
    };
    const replyReq = getFetchUrl('reply.list', replyData);
    const replyRes = replyReq && await fetch(replyReq);
    const replyResult = replyRes && await replyRes.json();
    
    const initProps = {
        seo: seoResult.data,
        filterCount: filterCountResult.data,
        paper,
        replyList: replyResult.data,

        paperId: paper.id,
    };

    return initProps;
};

export default withRouter(Paper);