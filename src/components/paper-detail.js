import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

import $ from 'jquery';
import hash from 'object-hash';

import { markdown } from 'lib';

import 'plugins/img-viewer/index.js';

const initImgViewer = () => {
  const checkMounted = setInterval(() => {
    try {
      if ($('.paper-body img.default').length) {
        clearInterval(checkMounted);
        $('.paper-body img.default').magnify({
          title: true,
          headToolbar: ['close'],
          footToolbar: ['zoomIn', 'zoomOut', 'actualSize'],
          initMaximized: true,
          zIndex: 999999,
        });
      }
    } catch (err) {} // eslint-disable-line
  }, 500);

  setTimeout(() => {
    clearInterval(checkMounted);
  }, 1500);
};
const processContent = paperInnerHTML => {
  let paperContentHTML = paperInnerHTML;

  try {
    let $paperContainer = document.createElement('div');

    $paperContainer.innerHTML = paperInnerHTML;
    $paperContainer = $($paperContainer);
    $paperContainer.find('img').each(function () {
      const typeReg = /\?type=/;
      const imgSrc = $(this).prop('src');
      const imgAlt = $(this).prop('alt');

      $(this).attr({
        'data-src': imgSrc,
        'data-caption': imgAlt,
      });

      if (!typeReg.test(imgSrc)) {
        $(this).addClass('default');
      } else {
        $(this).addClass(imgSrc.split(typeReg)[1] || '');
      }
    });

    paperContentHTML = $paperContainer.prop('innerHTML');
  } catch (err) {} // eslint-disable-line

  initImgViewer();

  return paperContentHTML;
};
const PaperBody = function (props) {
  const { paperId, content } = props;
  const [hashVal, setHashVal] = useState(hash.sha1(markdown(content)));
  const [paperContentBody, setPaperContentBody] = useState(markdown(content));

  useEffect(() => {
    setHashVal(hash.sha1(processContent(markdown(content))));
    setPaperContentBody(processContent(markdown(content)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperId, hashVal]);

  return <div className='paper-body' hash-val={hashVal} dangerouslySetInnerHTML={{ __html: paperContentBody }}></div>;
};
const PaperDetail = function (props) {
  const { paper, userInfo } = props;
  const paperTitle = paper.title;
  const dateVal = paper.gmtCreate ? paper.gmtCreate.slice(0, 10) : '';
  const tagVal = `${paper.tag}${paper.subtag ? `，${paper.subtag}` : ''}`;

  if (paper.id && paper.title && paper.gmtCreate && paper.tag && paper.content) {
    return (
      <div className='paper-detail'>
        <div className='paper-title'>{paperTitle}</div>
        <div className='paper-subtitle'>
          <div className='subtitle-tags pull-right'>
            <i className='fa fa-tags'></i>
            &nbsp;
            <span className='tags-val'>{tagVal}</span>
          </div>
          <div className='subtitle-date pull-right'>
            <i className='fa fa-calendar'></i>
            &nbsp;
            <span className='date-val'>{dateVal}</span>
          </div>
        </div>
        <hr />
        <PaperBody paperId={paper.id} content={paper.content} />
        {userInfo.isOwner ? (
          <Link href='/paper-submit/[id]' as={`/paper-submit/${paper.id}`}>
            <a className='edit-paper-link'>
              <i className='fa fa-edit'></i>
            </a>
          </Link>
        ) : null}
      </div>
    );
  }

  return null;
};

PaperBody.propTypes = {
  paperId: PropTypes.number,
  content: PropTypes.string,
};
PaperDetail.propTypes = {
  paper: PropTypes.object,
  userInfo: PropTypes.object,
};

export default PaperDetail;
