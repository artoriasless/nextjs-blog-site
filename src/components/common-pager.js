import React from 'react';
import PropTypes from 'prop-types';

const PagerFoot = function(props) {
    const {
        current,
        pageCount,
        jumpHandler,
    } = props;
    const pageLinkClass = (current === pageCount) ? 'page-link disable' : 'page-link';

    return (
        <li className="page-item">
            <span className={ pageLinkClass } onClick={ () => jumpHandler({page: pageCount,}) }>
                <i className="fa fa-step-forward"></i>
            </span>
        </li>
    );
};
const PagerNext = function(props) {
    const {
        current,
        pageCount,
        jumpHandler,
    } = props;
    const pageLinkClass = (current === pageCount) ? 'page-link disable' : 'page-link';

    return (
        <li className="page-item">
            <span className={ pageLinkClass } onClick={ () => jumpHandler({page: (current + 1),}) }>
                <i className="fa fa-angle-right"></i>
            </span>
        </li>
    );
};
const PagerNextEllipsis = function(props) {
    const {
        current,
        pageCount,
        jumpHandler,
    } = props;
    const pageArr = [];

    for (let i = 0; i < 3; i++) {
        pageArr.push(
            <li key={ `page_link_${current + i + 1}` } className="page-item">
                <span className="page-link" onClick={ () => jumpHandler({page: (current + i + 1),}) }>
                    { current + i + 1 }
                </span>
            </li>
        );
    }

    switch(current) {
    case pageCount:
        return null;
    case (pageCount - 1):
        pageArr.pop();
        pageArr.pop();
        break;
    case (pageCount - 2):
        pageArr.pop();

        if (pageCount > 3) {
            pageArr.pop();
            pageArr.push(
                <li className="page-item" key="page_link_ellipsis_next">
                    <span className="page-link ellipsis">
                        <i className="fa fa-ellipsis-h"></i>
                    </span>
                </li>
            );
        }

        break;
    default:
        pageArr.pop();
        pageArr.push(
            <li className="page-item" key="page_link_ellipsis_next">
                <span className="page-link ellipsis">
                    <i className="fa fa-ellipsis-h"></i>
                </span>
            </li>
        );
    }

    return pageArr;
};
const PagerCurrent = function(props) {
    const current = props.current;

    return (
        <li className="page-item">
            <span className="page-link active">
                { current }
            </span>
        </li>
    );
};
const PagerPrevEllipsis = function(props) {
    const {
        current,
        pageCount,
        jumpHandler
    } = props;
    const pageArr = [];

    for (let i = 0; i < 3; i++) {
        pageArr.unshift(
            <li key={ `page_link_${current - i - 1}` }className="page-item">
                <span className="page-link" onClick={ () => jumpHandler({page: (current - i - 1),}) }>
                    { current - i - 1 }
                </span>
            </li>
        );
    }

    switch(current) {
    case 1:
        return null;
    case 2:
        pageArr.shift();
        pageArr.shift();
        break;
    case 3:
        pageArr.shift();

        if (pageCount > 3) {
            pageArr.shift();
            pageArr.unshift(
                <li className="page-item" key="page_link_ellipsis_prev">
                    <span className="page-link ellipsis">
                        <i className="fa fa-ellipsis-h"></i>
                    </span>
                </li>
            );
        }

        break;
    default:
        pageArr.shift();
        pageArr.unshift(
            <li className="page-item" key="page_link_ellipsis_prev">
                <span className="page-link ellipsis">
                    <i className="fa fa-ellipsis-h"></i>
                </span>
            </li>
        );
    }

    return pageArr;
};
const PagerPrev = function(props) {
    const {
        current,
        jumpHandler,
    } = props;
    const pageLinkClass = (current === 1) ? 'page-link disable' : 'page-link';

    return (
        <li className="page-item">
            <span className={ pageLinkClass } onClick={ () => jumpHandler({page: (current - 1),}) }>
                <i className="fa fa-angle-left"></i>
            </span>
        </li>
    );
};
const PagerHead = function(props) {
    const {
        current,
        jumpHandler,
    } = props;
    const pageLinkClass = (current === 1) ? 'page-link disable' : 'page-link';

    return (
        <li className="page-item">
            <span className={ pageLinkClass } onClick={ () => jumpHandler({page: 1,}) }>
                <i className="fa fa-step-backward"></i>
            </span>
        </li>
    );
};
const CommonPager = function(props) {
    const {
        data,
        jumpHandler,
    } = props;
    const {
        current,
        dataCount,
    } = data;
    const pageCount = Math.ceil(dataCount / 10);

    if (pageCount === 1) {
        return null;
    } else {
        return (
            <div className="pager-container">
                <div className="pager-tips">
                    { current }/{ pageCount }
                </div>
                <nav className="pager-content" aria-label="Page navigation example">
                    <ul className="pagination">
                        <PagerHead current={ current } jumpHandler={ jumpHandler }/>
                        <PagerPrev current={ current } jumpHandler={ jumpHandler }/>
                        <PagerPrevEllipsis
                            current={ current }
                            jumpHandler={ jumpHandler }
                            pageCount={ pageCount }
                        />
                        <PagerCurrent current={ current }/>
                        <PagerNextEllipsis
                            current={ current }
                            jumpHandler={ jumpHandler }
                            pageCount={ pageCount }
                        />
                        <PagerNext
                            current={ current }
                            jumpHandler={ jumpHandler }
                            pageCount={ pageCount }
                        />
                        <PagerFoot
                            current={ current }
                            jumpHandler={ jumpHandler }
                            pageCount={ pageCount }
                        />
                    </ul>
                </nav>
            </div>
        );
    }
};

PagerFoot.propTypes = {
    current: PropTypes.number,
    jumpHandler: PropTypes.func.isRequired,
    pageCount: PropTypes.number
};
PagerNext.propTypes = {
    current: PropTypes.number,
    jumpHandler: PropTypes.func.isRequired,
    pageCount: PropTypes.number
};
PagerNextEllipsis.propTypes = {
    current: PropTypes.number,
    jumpHandler: PropTypes.func.isRequired,
    pageCount: PropTypes.number
};
PagerCurrent.propTypes = {
    current: PropTypes.number,
};
PagerPrevEllipsis.propTypes = {
    current: PropTypes.number,
    jumpHandler: PropTypes.func.isRequired,
    pageCount: PropTypes.number
};
PagerPrev.propTypes = {
    current: PropTypes.number,
    jumpHandler: PropTypes.func.isRequired
};
PagerHead.propTypes = {
    current: PropTypes.number,
    jumpHandler: PropTypes.func.isRequired
};
CommonPager.propTypes = {
    data: PropTypes.object,
    jumpHandler: PropTypes.func,
};

export default CommonPager;