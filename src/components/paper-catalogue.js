import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PagerHead = function(props) {
    return (
        <li className="page-item">
            <Link href="/catalogue/[type]/[page]" as={ `${props.prefix}1` }>
                <a className={ props.current === 1 ? 'page-link disable' : 'page-link' }>
                    <i className="fa fa-step-backward"></i>
                </a>
            </Link>
        </li>
    );
};
const PagerPrev = function(props) {
    return (
        <li className="page-item">
            <Link href="/catalogue/[type]/[page]" as={ `${props.prefix}${props.current - 1}` }>
                <a className={ props.current === 1 ? 'page-link disable' : 'page-link' }>
                    <i className="fa fa-angle-left"></i>
                </a>
            </Link>
        </li>
    );
};
const PagerPrevEllipsis = function(props) {
    const {
        current,
        pageCount,
        prefix,
    } = props;
    const pageArr = [];

    for (let i = 0; i < 3; i++) {
        pageArr.unshift(
            <li key={ `page_link_${current - i - 1}` } className="page-item">
                <Link href="/catalogue/[type]/[page]" as={ `${prefix}${current - i - 1}` }>
                    <a className="page-link">
                        { current - i - 1 }
                    </a>
                </Link>
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
const PagerCurrent = function(props) {
    return (
        <li className="page-item">
            <span className="page-link active">
                { props.current }
            </span>
        </li>
    );
};
const PagerNextEllipsis = function(props) {
    const {
        current,
        pageCount,
        prefix
    } = props;
    const pageArr = [];

    for (let i = 0; i < 3; i++) {
        pageArr.push(
            <li key={ `page_link_${current + i + 1}` } className="page-item">
                <Link href="/catalogue/[type]/[page]" as={ `${prefix}${current + i + 1}` }>
                    <a className="page-link">
                        { current + i + 1 }
                    </a>
                </Link>
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
const PagerNext = function(props) {
    return (
        <li className="page-item">
            <Link href="/catalogue/[type]/[page]" as={ `${props.prefix}${props.current + 1}` }>
                <a className={ props.current === props.pageCount ? 'page-link disable' : 'page-link' }>
                    <i className="fa fa-angle-right"></i>
                </a>
            </Link>
        </li>
    );
};
const PagerFoot = function(props) {
    return (
        <li className="page-item">
            <Link href="/catalogue/[type]/[page]" as={ `${props.prefix}${props.pageCount}` }>
                <a className={ props.current === props.pageCount ? 'page-link disable' : 'page-link' }>
                    <i className="fa fa-step-forward"></i>
                </a>
            </Link>
        </li>
    );
};
const CataloguePager = function(props) {
    const {
        catalogue,
        filterType,
        filterParam,
    } = props;
    const current = catalogue.page;
    const pageCount = Math.ceil(catalogue.count / 10);
    const prefix = filterType === 'all' ? '/catalogue/all/' : `/catalogue/${filterType}>${filterParam}/`;

    if (pageCount <= 1) {
        return null;
    }

    return (
        <div className="catalogue-pager">
            <hr/>
            <div className="pager-container">
                <div className="pager-tips">
                    { current }/{ pageCount }
                </div>
                <nav className="pager-content" aria-label="Page navigation example">
                    <ul className="pagination">
                        <PagerHead current={ current } prefix={ prefix }/>
                        <PagerPrev current={ current } prefix={ prefix }/>
                        <PagerPrevEllipsis 
                            current={ current }
                            pageCount={ pageCount }
                            prefix={ prefix }
                        />
                        <PagerCurrent current={ current }/>
                        <PagerNextEllipsis 
                            current={ current }
                            pageCount={ pageCount }
                            prefix={ prefix }
                        />
                        <PagerNext 
                            current={ current }
                            pageCount={ pageCount }
                            prefix={ prefix }
                        />
                        <PagerFoot 
                            current={ current }
                            pageCount={ pageCount }
                            prefix={ prefix }
                        />
                    </ul>
                </nav>
            </div>
        </div>
    );
};

const CatalogueItem = function(props) {
    const {
        data,
        userInfo,
    } = props;
    const detailUrl = `/paper/${data.id}`;
    const catalogueItemTitle = data.title;
    const catalogueItemBrief = data.brief;
    const dateVal = data.gmtCreate.slice(0, 10);
    const tagVal = `${data.tag}${data.subtag ? `，${data.subtag}` : ''}`;

    return (
        <div className="catalogue-item">
            <Link href="/paper/[id]" as={ detailUrl }>
                <a title={ catalogueItemTitle } className="catalogue-item-title">
                    { catalogueItemTitle }
                </a>
            </Link>
            <div className="catalogue-item-subtitle">
                <div className="subtitle-tags pull-right">
                    <i className="fa fa-tags"></i>
                    &nbsp;
                    <span className="tags-val">
                        { tagVal }
                    </span>
                </div>
                <div className="subtitle-date pull-right">
                    <i className="fa fa-calendar"></i>
                    &nbsp;
                    <span className="date-val">
                        { dateVal }
                    </span>
                </div>
            </div>
            <p className="catalogue-item-brief">
                { catalogueItemBrief }
            </p>
            {
                !userInfo.isOwner ? null : (
                    <Link href="/paper-submit/[id]" as={ `/paper-submit/${data.id}` }>
                        <a className="edit-paper-link">
                            <i className="fa fa-edit"></i>
                        </a>
                    </Link>
                )
            }
        </div>
    );
};
const CatalogueList = function(props) {
    const {
        catalogue,
        userInfo,
    } = props;
    const catalogueList = catalogue.rows || [];

    if (catalogueList.length === 0) {
        return (
            <div className="no-item-tips">
                catalogue list is empty
                <br/>
                please check the url is right
            </div>
        );
    }

    return (
        <div className="catalogue-list">
            {
                catalogueList.map(item => {
                    const key = `catalogueItem_${item.id}`;

                    return (
                        <CatalogueItem
                            data={ item }
                            userInfo={ userInfo }
                            key={ key }
                        />
                    );
                })
            }
        </div>
    );
};
const PaperCatalogue = function(props) {
    const {
        userInfo,
        catalogue,
        filterType,
        filterParam,
    } = props;
    const subtitle = `/${filterType}${filterType === 'all' ? '' : ('/' + filterParam)}`;

    return (
        <div className="catalogue-container col-xs-12 col-md-8 col-lg-9">
            <div className="catalogue-content">
                <div className="catalogue-title">
                    Catalogue<span className="subtitle">{ subtitle }</span>
                </div>
                <hr/>
                <CatalogueList catalogue={ catalogue } userInfo={ userInfo }/>
                <CataloguePager
                    filterType={ filterType }
                    filterParam={ filterParam }
                    catalogue={ catalogue }
                />
            </div>
        </div>
    );
};

PagerHead.propTypes = {
    current: PropTypes.number,
    prefix: PropTypes.string,
};
PagerPrev.propTypes = {
    current: PropTypes.number,
    prefix: PropTypes.string,
};
PagerPrevEllipsis.propTypes = {
    current: PropTypes.number,
    prefix: PropTypes.string,
    pageCount: PropTypes.number,
};
PagerCurrent.propTypes = {
    current: PropTypes.number,
};
PagerNextEllipsis.propTypes = {
    current: PropTypes.number,
    prefix: PropTypes.string,
    pageCount: PropTypes.number,
};
PagerNext.propTypes = {
    current: PropTypes.number,
    prefix: PropTypes.string,
    pageCount: PropTypes.number,
};
PagerFoot.propTypes = {
    current: PropTypes.number,
    prefix: PropTypes.string,
    pageCount: PropTypes.number,
};
CataloguePager.propTypes = {
    catalogue: PropTypes.object,
    filterType: PropTypes.string,
    filterParam: PropTypes.string,
};

CatalogueItem.propTypes = {
    data: PropTypes.object,
    userInfo: PropTypes.object,
};
CatalogueList.propTypes = {
    catalogue: PropTypes.object,
    userInfo: PropTypes.object,
};
PaperCatalogue.propTypes = {
    userInfo: PropTypes.object,
    catalogue: PropTypes.object,
    filterType: PropTypes.string,
    filterParam: PropTypes.string,
};

export default PaperCatalogue;