import React, { useState, useEffect, } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

import {
    Fade,
    Col,
} from 'react-bootstrap';

const FilterContentLatest = function(props) {
    const filter = props.filter;
    const filterRows = filter.rows;

    return (
        <div className="filter-content">
            <dl className="filter-list latest">
                <dt className="filter-list-title">
                    Latest
                </dt>
                {
                    filterRows.map((filterItem, index) => {
                        const key = `latestFilterItem_${index}`;
                        const no = `${index + 1}.`;
                        const detailUrl = `/paper/${filterItem.id}`;
                        const filterItemVal = filterItem.title;

                        return (
                            <dd className="filter-list-item" key={ key }>
                                <Link href="/paper/[id]" as={ detailUrl }>
                                    <a title={filterItemVal} className="item-link">
                                        { no }{ filterItemVal }
                                    </a>
                                </Link>
                            </dd>
                        );
                    })
                }
            </dl>
        </div>
    );
};
const FilterContentTag = function(props) {
    const filter = props.filter;
    const filterCount = filter.count;
    const filterRows = filter.rows;

    return (
        <div className="filter-content">
            <dl className="filter-list tag">
                <dt className="filter-list-title">
                    Tags
                </dt>
                {
                    filterRows.map((filterItem, index) => {
                        const key = `tagsFilterItem_${index}`;
                        const detailUrl = `/catalogue/tag>${filterItem.tag}/1`;
                        const filterItemVal = filterItem.tag;
                        const filterItemCount = `(${filterCount[index].count})`;

                        return (
                            <dd className="filter-list-item" key={ key }>
                                <Link href="/catalogue/[type]/[page]" as={ detailUrl }>
                                    <a className="item-link" href={ detailUrl }>
                                        <span className="tag-val">
                                            { filterItemVal }
                                        </span>
                                        <span className="tag-count">
                                            { filterItemCount }
                                        </span>
                                    </a>
                                </Link>
                            </dd>
                        );
                    })
                }
            </dl>
        </div>
    );
};
const FilterContentTimeline = function(props) {
    const filter = props.filter;
    const filterCount = filter.count;
    const filterRows = filter.rows;

    return (
        <div className="filter-content">
            <dl className="filter-list timeline">
                <dt className="filter-list-title">
                    Timeline
                </dt>
                {
                    filterRows.map((filterItem, index) => {
                        const key = `timelineFilterItem_${index}`;
                        const detailUrl = `/catalogue/timeline>${filterItem.yearTag}/1`;
                        const filterItemVal = filterItem.yearTag;
                        const filterItemCount = `(${filterCount[index].count})`;

                        return (
                            <dd className="filter-list-item" key={ key }>
                                <Link href="/catalogue/[type]/[page]" as={ detailUrl }>
                                    <a className="item-link">
                                        <span className="timeline-val">
                                            { filterItemVal }
                                        </span>
                                        <span className="timeline-count">
                                            { filterItemCount }
                                        </span>
                                    </a>
                                </Link>
                            </dd>
                        );
                    })
                }
            </dl>
        </div>
    );
};
const CommonFilterCount = function(props) {
    const [ expanded, setExpanded ] = useState(false);
    const filterCount = props.filterCount;
    const {
        latest = { count: 0, rows: [], },
        tag = { count: 0, rows: [], },
        timeline = { count: 0, rows: [], },
    } = filterCount;
    const togglePaperFilter = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        try {
            setExpanded(window.innerWidth >= 768);
            window.onresize = () => {
                setExpanded(window.innerWidth >= 768);
            };
        } catch (err) {} // eslint-disable-line
    }, []);

    return (
        <>
            <span className={ `paper-filter-toggler ${expanded ? 'expanded' : ''}` }>
                <i onClick={ togglePaperFilter } className="fa fa-expand show-icon pull-left"></i>
                <i onClick={ togglePaperFilter } className="fa fa-compress hide-icon pull-right"></i>
            </span>
            <Fade in={ expanded }>
                <Col
                    xs={ 12 }
                    md={ 4 }
                    lg={ 3 }
                    className={ `filter-container ${expanded ? '' : 'hidden'}` }
                >
                    <FilterContentLatest filter={ latest }/>
                    <FilterContentTag filter={ tag }/>
                    <FilterContentTimeline filter={ timeline }/>
                </Col>
            </Fade>
        </>
    );
};

FilterContentLatest.propTypes = {
    filter: PropTypes.object,
};
FilterContentTag.propTypes = {
    filter: PropTypes.object,
};
FilterContentTimeline.propTypes = {
    filter: PropTypes.object,
};
CommonFilterCount.propTypes = {
    filterCount: PropTypes.object,
};

export default CommonFilterCount;