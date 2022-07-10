import React from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';

import config from 'config';
import { getFetchUrl } from 'lib';
import { TitleGenerator, HeadGenerator, Layout, Navbar, LoginModal } from 'components';

import 'style/pages/home.scss';

const UI_Home = function (props) {
  const seo = props.seo;

  return (
    <>
      <TitleGenerator title={seo.title} />
      <HeadGenerator seo={seo} />
      <Layout>
        <div className='page-home'>
          <Navbar />
          <div className='page-section-body'>
            <div className='main'>
              <h1 className='main-title'>Artoriasless</h1>
              <h3 className='sub-title'>thanks for visiting my blog,hope to code less,do more</h3>
              <h4 className='refer-info'>valar morghulis,valar dohaeris</h4>
              <div className='quick-link-container'>
                <div className='quick-link-content'>
                  <a
                    rel='noopener noreferrer'
                    target='_blank'
                    href='https://github.com/artoriasless'
                    className='quick-link'
                  >
                    <span className='link-img github-link'></span>
                    view on Github
                  </a>
                </div>
                <div className='quick-link-content'>
                  <Link href='/catalogue/[type]/[page]' as='/catalogue/all/1'>
                    <a className='quick-link'>
                      <i className='link-img blog-link'></i>
                      view blog
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className='archiving-container'>
            <a href='//www.beian.miit.gov.cn' rel='noopener noreferrer' target='_blank' className='archiving-link'>
              {config.archiving}
            </a>
          </div>
        </div>
      </Layout>
      <LoginModal />
    </>
  );
};
const mapState2Props = (state, props) => Object.assign({}, state, props);
const mapDispatch2Props = () => ({});
let Home;

UI_Home.propTypes = {
  seo: PropTypes.object,
};
Home = connect(mapState2Props, mapDispatch2Props)(UI_Home);
Home.getInitialProps = async () => {
  const seoData = {
    pageName: 'home',
  };
  const seoReq = getFetchUrl('util.seo', seoData);
  const seoRes = seoReq && (await fetch(seoReq));
  const seoResult = seoRes && (await seoRes.json());

  const initProps = {
    seo: seoResult.data,
  };

  return initProps;
};

export default Home;
