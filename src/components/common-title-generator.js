import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

const CommonTitleGenerator = function(props) {
    const title = props.title || '';

    return (
        <Head>
            <title>
                { title }
            </title>
        </Head>
    );
};

CommonTitleGenerator.propTypes = {
    title: PropTypes.string,
};

export default CommonTitleGenerator;