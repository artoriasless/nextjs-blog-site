import React, { useState, useEffect, } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import $ from 'jquery';

import {
    Navbar,
    Nav,
} from 'react-bootstrap';

import config from 'config';
import {
    ajaxAction,
    stanAlert,
} from 'lib';
import {
    toggleHidden,
    logout,
} from 'actions';

const checkUserAvatar = (uuid, cbFunc) => {
    if (uuid === undefined) return;
    
    try {
        $.get(`${config.ossPublic.userPrefix}/${uuid}.jpg`, function() {
            cbFunc && cbFunc();
        });
    } catch(err){
        // do nothing
    }
};
const NavbarRight = function(props) {
    const {
        userInfo,
        ajaxLogout,
    } = props;
    const [showAdminLinks, setShowAdminLinks] = useState(false);
    const [avatarLink, setAvatarLink] = useState(`${config.ossPublic.userPrefix}/default.jpg`);
    const userName = userInfo.userName;
    const userNameClass = !userInfo.isEnabled ? 'user-name inactivated' : 'user-name';

    useEffect(() => {
        checkUserAvatar(userInfo.uuid, () => {
            setAvatarLink(`${config.ossPublic.userPrefix}/${userInfo.uuid}.jpg`);
        });
    }, [userInfo.uuid]);

    return (
        <Nav className="justify-content-end">
            {
                userInfo.isOwner && userInfo.uuid ? (
                    <div className="dropdown nav-item">
                        <div className="dropdown-toggle nav-link" onClick={ () => setShowAdminLinks(!showAdminLinks) }  >
                            Admin
                        </div>
                        <div className={ `dropdown-menu ${showAdminLinks ? 'show' : ''}` }>
                            <div className="dropdown-item">
                                <Link href="/paper-submit/[id]" as="/paper-submit/0">
                                    <a className="nav-link" rel="nofollow">
                                        Add Paper
                                    </a>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : null
            }
            <Nav.Item>
                <Link href="/catalogue/[type]/[page]" as="/catalogue/all/1">
                    <a className="nav-link">
                        Catalogue
                    </a>
                </Link>
            </Nav.Item>
            <Nav.Item>
                {
                    userInfo.id && userInfo.email && userInfo.password ? (
                        <Link href="/profile/[uuid]" as={ `/profile/${userInfo.uuid}` }>
                            <a className="nav-link user-center-link" rel="nofollow">
                                <img className="user-avatar" src={ avatarLink }/>
                                <span className={ userNameClass }>
                                    { userName }
                                </span>
                            </a>
                        </Link>
                    ) : (
                        <Nav.Link eventKey="loginLink" className="login-link">
                            Guest,please login...
                        </Nav.Link>
                    )
                }
            </Nav.Item>
            {
                userInfo.id && userInfo.email && userInfo.password ? (
                    <Nav.Item>
                        <Nav.Link className="logout-link" onClick={ ajaxLogout }>
                            Logout
                        </Nav.Link>
                    </Nav.Item>
                ) : null
            }
        </Nav>
    );
};
const UI_Navbar = function(props) {
    const {
        userInfo,
        showLoginModal,
        ajaxLogout,
    } = props;
    const assetPrefix = config.dev ? '' : config.ossPublic.assetPrefix;
    const selectNavLink = evtKey => {
        if (evtKey === 'loginLink') {
            showLoginModal();
        }
    };

    return (
        <div className="common-navbar-container">
            <Navbar
                collapseOnSelect
                expand="md"
                variant="light"
                className="common-navbar"
                id="navbarLeft"
                onSelect={ selectNavLink }
            >
                <Navbar.Brand>
                    <Link href="/">
                        <a className="logo">
                            <img
                                src={ `${assetPrefix}/static/img/logo.jpg` }
                                width="30"
                                height="30"
                                className="d-inline-block align-top"
                                alt="stanby logo"
                            />
                        </a>
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarRight">
                    <i className="fa"></i>
                </Navbar.Toggle>
                <Navbar.Collapse id="navbarRight">
                    <NavbarRight userInfo={ userInfo } ajaxLogout={ ajaxLogout }/>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
};

const mapState2Props = state => state;
const mapDispatch2Props = dispatch => ({
    showLoginModal: () => dispatch(toggleHidden('loginModal')),
    ajaxLogout: () => {
        const successFunc = result => {
            if (result.success === undefined) {
                stanAlert({
                    type: 'danger',
                    textAlign: 'center',
                    content: 'something wrong happened in server side....',
                });
            } else {
                if (result.success) {
                    dispatch(logout(result.data));
                }

                stanAlert({
                    type: result.success ? 'success' : 'danger',
                    textAlign: 'center',
                    content: result.message,
                });
            }
        };
        const failFunc = err => {
            stanAlert({
                title: 'Warning!',
                type: 'danger',
                textAlign: 'center',
                content: 'wrong network connect, please try again later...',
            });
            console.error(err);  // eslint-disable-line
        };

        ajaxAction('user.logout', {}, successFunc, failFunc);
    },
});
let CommonNavbar;

NavbarRight.propTypes = {
    userInfo: PropTypes.object,
    ajaxLogout: PropTypes.func,
};
UI_Navbar.propTypes = {
    userInfo: PropTypes.object,
    showLoginModal: PropTypes.func,
    ajaxLogout: PropTypes.func,
};
CommonNavbar = connect(
    mapState2Props,
    mapDispatch2Props,
)(UI_Navbar);

export default CommonNavbar;