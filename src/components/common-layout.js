import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Fade,
} from 'react-bootstrap';

import {
    getUserDefault,
} from 'actions';
import {
    ajaxAction,
} from 'lib';

const UI_Layout = function(props) {
    const {
        ajaxGetUserDefault,
        children,
    } = props;
    const [finishReq, setFinishReq] = useState(false);

    useEffect(() => {
        ajaxGetUserDefault(() => {
            setTimeout(() => {
                !finishReq && setFinishReq(true);
            }, 250);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {
                finishReq ? null : (
                    <div className="stan-loading-container">
                        <div className="stan-loading-content"></div>
                    </div>
                )
            }
            <Fade in={ finishReq }>
                <div id="root">
                    <div className="app">
                        { children }
                    </div>
                    <div className="dialog">
                    </div>
                </div>
            </Fade>
        </>
    );
};
const mapState2Props = state => state;
const mapDispatch2Props = dispatch => ({
    ajaxGetUserDefault: cbFunc => {
        const successFunc = result => {
            if (result.success) {
                dispatch(getUserDefault(result.data));
            }
            cbFunc && cbFunc();
        };
        const failFunc = () => {
            cbFunc && cbFunc();
        };

        ajaxAction('user.default', {}, successFunc, failFunc);
    },
});
let CommonLayout;

UI_Layout.propTypes = {
    children: PropTypes.object,
    ajaxGetUserDefault: PropTypes.func,
};
CommonLayout = connect(
    mapState2Props,
    mapDispatch2Props,
)(UI_Layout);

export default CommonLayout;