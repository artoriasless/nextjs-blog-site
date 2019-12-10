import React, { memo, useState, useEffect, } from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-unfetch';

import $ from 'jquery';
import {
    Button,
    Modal,
    Row,
    Col,
} from 'react-bootstrap';

import config from 'config';
import {
    getFetchUrl,
    stanAlert,
    stanLoading,
    ajaxAction,
} from 'lib';
import {
    logout,
    updateUserInfo,
    increaseCount,
} from 'actions';
import {
    TitleGenerator,
    HeadGenerator,
    Layout,
    Navbar,
    ClockShow,
    Pager,
} from 'components';

import 'style/pages/profile.scss';

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
const submitInfoValidate = formData => {
    const alertInfo = {
        title: 'Warning!',
        userName: {
            null: 'please type your user name!',
            illegal: 'the user name can\'t exceed 15 characters in length!',
        },
    };

    if (!formData.userName) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.userName.null,
        });

        return false;
    } else if (formData.userName.length > 15) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.userName.illegal,
        });

        return false;
    }

    return true;
};
const submitPwdValidate = formData => {
    const pwdReg = /^\S{10,18}$/;
    const alertInfo = {
        title: 'Warning!',
        original: {
            null: 'please type the original pwd!',
            illegal: 'please type legal pwd!<br/>pwd length from 10 to 16.',
        },
        modify: {
            null: 'please type the new pwd!',
            illegal: 'please type legal pwd!<br/>pwd length from 10 to 16.',
        },
        confirm: {
            null: 'please retype the pwd to check!',
            illegal: 'the pwd to confirm is inconsistent!'
        }
    };

    if (!formData.original) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.original.null,
        });

        return false;
    } else if (!pwdReg.test(formData.original)) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.original.illegal,
        });

        return false;
    } else if (!formData.modify) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.modify.null
        });

        return false;
    } else if (!pwdReg.test(formData.modify)) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.modify.illegal,
        });

        return false;
    } else if (!formData.confirm) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.confirm.null,
        });

        return false;
    } else if (formData.modify !== formData.confirm) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.confirm.illegal,
        });

        return false;
    }

    return true;
};

const EditInfoModal = function(props) {
    const {
        show,
        userInfo,
        toggleEditInfoModal,
        ajaxUpdateInfo,
    } = props;
    const [userInfoForm, setUserInfoForm] = useState({
        userName: userInfo.userName,
        gender: userInfo.gender,
    });
    const submitForm = () => {
        if (submitInfoValidate(userInfoForm)) {
            ajaxUpdateInfo(userInfoForm, toggleEditInfoModal);
        }
    };
    const formChangeHandler = (evt, key) => {
        const tmpUserInfo = Object.assign({}, userInfoForm);

        tmpUserInfo[key] = evt.target.value.trim();
        tmpUserInfo[key] = key === 'gender' ? Number(tmpUserInfo[key]) : tmpUserInfo[key];
        setUserInfoForm(tmpUserInfo);
    };
    const enterSubmitHandler = evt => {
        if (evt.keyCode === 13) {
            evt.preventDefault();

            submitForm();
        }
    };

    useEffect(() => {
        setUserInfoForm({
            userName: userInfo.userName,
            gender: userInfo.gender,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo.userName, userInfo.gender, show]);

    return (
        <Modal
            id="editInfoModal"
            className="common-modal"
            show={ show }
            onHide={ toggleEditInfoModal }
            centered={ true }
        >
            <Modal.Header closeButton>
                <Modal.Title className="confirm-title">
                    Edit User Info
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form id="editInfoForm">
                    <div className="form-group">
                        <label htmlFor="editInfo_userName">
                            user name
                        </label>
                        <input
                            id="editInfo_userName"
                            className="form-control"
                            type="text"
                            placeholder="type your user name"
                            name="userName"
                            defaultValue={ userInfoForm.userName }
                            onChange={ event => formChangeHandler(event, 'userName') }
                            onKeyDown={ event => enterSubmitHandler(event) }
                        />
                    </div>
                    <div className="form-group">
                        <label>
                            gender
                        </label>
                        <div className="gender-radio-contaienr">
                            <div className="stan-radio-container">
                                <label className="stan-radio">
                                    <i className="fa fa-venus"></i>
                                    Female
                                    <input
                                        className="stan-radio-input"
                                        type="radio"
                                        name="gender"
                                        value="0"
                                        defaultChecked={ userInfoForm.gender === 0 }
                                        onChange={ event => formChangeHandler(event, 'gender') }
                                    />
                                    <div className="stan-radio-indicator"></div>
                                </label>
                            </div>
                            <div className="stan-radio-container">
                                <label className="stan-radio">
                                    <i className="fa fa-mars"></i>
                                    Male
                                    <input
                                        className="stan-radio-input"
                                        type="radio"
                                        name="gender"
                                        value="1"
                                        defaultChecked={ userInfoForm.gender === 1 }
                                        onChange={ event => formChangeHandler(event, 'gender') }
                                    />
                                    <div className="stan-radio-indicator"></div>
                                </label>
                            </div>
                            <div className="stan-radio-container">
                                <label className="stan-radio">
                                    <i className="fa fa-transgender"></i>
                                    Transgender
                                    <input
                                        className="stan-radio-input"
                                        type="radio"
                                        name="gender"
                                        value="2"
                                        defaultChecked={ userInfoForm.gender === 2 }
                                        onChange={ event => formChangeHandler(event, 'gender') }
                                    />
                                    <div className="stan-radio-indicator"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal.Body>

            <Modal.Footer>
                <Button 
                    variant="primary"
                    className="submit-btn"
                    onClick={ submitForm }
                >
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
const EditPwdModal = function(props) {
    const {
        show,
        toggleEditPwdModal,
        ajaxUpdatePwd,
    } = props;
    const [pwdForm, setPwdForm] = useState({
        original: '',
        modify: '',
        confirm: '',
    });
    const formChangeHandler = (evt, key) => {
        const tmpPwdForm = Object.assign({}, pwdForm);

        tmpPwdForm[key] = (evt.target.value).trim();
        setPwdForm(tmpPwdForm);
    };
    const submitForm = (evt) => { // eslint-disable-line
        if (submitPwdValidate(pwdForm || {})) {
            ajaxUpdatePwd(pwdForm, toggleEditPwdModal);
        }
    };
    
    return (
        <Modal
            id="editPwdModal"
            className="common-modal"
            show={ show }
            onHide={ toggleEditPwdModal }
            centered={ true }
        >
            <Modal.Header closeButton>
                <Modal.Title className="confirm-title">
                    Modify Your Password
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form id="editPwdForm">
                    <div className="form-group">
                        <label htmlFor="editPwd_original">
                            original password
                        </label>
                        <input
                            id="editPwd_original"
                            className="form-control"
                            type="password"
                            placeholder="type your original pwd"
                            onChange={ event => formChangeHandler(event, 'original') }
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="editPwd_new">
                            new password
                        </label>
                        <input
                            id="editPwd_new"
                            className="form-control"
                            type="password"
                            placeholder="type your new pwd"
                            onChange={ event => formChangeHandler(event, 'modify') }
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="editPwd_confirm">
                            confirm new password
                        </label>
                        <input
                            id="editPwd_confirm"
                            className="form-control"
                            type="password"
                            placeholder="confirm your new pwd"
                            onChange={ event => formChangeHandler(event, 'confirm') }
                        />
                    </div>
                </form>
            </Modal.Body>

            <Modal.Footer>
                <Button 
                    variant="primary"
                    className="submit-btn"
                    onClick={ submitForm }
                >
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const UserComment = memo(function Mod() {
    const [msg, setMsg] = useState({
        count: 0,
        page: 1,
        rows: [],
    });
    const {
        count,
        page,
        rows,
    } = msg;
    const pagerData = {
        current: page,
        dataCount: count,
    };
    const getMessage = jsonData => {
        const successFunc = result => {
            if (result.success) {
                setMsg(result.data);
            } else {
                stanAlert({
                    title: 'Warning!',
                    content: result.message,
                });
            }
        };
        const failFunc = err => {
            stanAlert({
                title: 'Warning!',
                content: err.toString(),
            });
            console.info(err); // eslint-disable-line
        };

        ajaxAction('message.page', jsonData, successFunc, failFunc);
    };

    useEffect(() => {
        getMessage({
            page: 1
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Col xs={ 12 } sm={ 12 } md={ 7 } lg={ 8 } className="user-comment">
            <div className="comment-wrap">
                <div className="comment-title">
                    My Messages
                </div>
                <div className={ count === 0 ? 'comment-content empty' : 'comment-content' }>
                    {
                        count === 0 ? 'message list is empty!' : (
                            rows.map((msgItem, idx) => {
                                let msgNo = (page - 1) * 10 + idx + 1;
                                let msgItemClassArr = [
                                    'message-item',
                                    'paper-reply',
                                ];

                                if (!msgItem.isRead) {
                                    msgItemClassArr.push('unread');
                                }

                                if (msgNo < 10) {
                                    msgNo = `0${msgNo}`;
                                }

                                return (
                                    <div
                                        data-no={ msgNo }
                                        key={ `message_item_${msgItem.id}` }
                                        className={ msgItemClassArr.join(' ') }
                                    >
                                        <a
                                            href={ `/paper/${msgItem.paperId}` }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            { msgItem.content }
                                        </a>
                                    </div>
                                );
                            })
                        )
                    }
                </div>
                {
                    count !== 0 ?
                        <Pager jumpHandler={ getMessage } data={ pagerData }/> :
                        null
                }
            </div>
        </Col>
    );
}, (prevProps, nextProps) => Boolean('CONSTANT_PROPS')); // eslint-disable-line
const UserAd = memo(function Mod() {
    return (
        <Col xs={ 12 } sm={ 12 } md={ 5 } lg={ 4 } className="user-ad">
            <div className="ad-wrap">
                <ClockShow/>
            </div>
        </Col>
    );
}, (prevProps, nextProps) => Boolean('CONSTANT_PROPS')); // eslint-disable-line
const UserInfo = function(props) {
    const userInfo = props.userInfo;

    return (
        <Col xs={ 12 } sm={ 12 } md={ 7 } lg={ 8 } className="user-info">
            <div className="info-wrap">
                <div className="user-info-item">
                    <div className="user-info-title">
                        Register Mail
                    </div>
                    <div className="user-info-content">
                        { userInfo.email }
                    </div>
                </div>
                <div className="user-info-item">
                    <div className="user-info-title">
                        Register Date
                    </div>
                    <div className="user-info-content">
                        { userInfo.gmtCreate }
                    </div>
                </div>
                <div className="user-info-item">
                    <div className="user-info-title">
                        Register Ip
                    </div>
                    <div className="user-info-content">
                        { userInfo.registerIp }
                    </div>
                </div>
            </div>
        </Col>
    );
};
const UserOverview = function(props) {
    const {
        _count,
        userInfo,
        toggleEditInfoModal,
        toggleEditPwdModal,
        updateAvatarCount,
        activateAccount,
        resetPwd,
    } = props;
    const genderMap = [
        'venus',
        'mars',
        'transgender',
    ];
    const genderClass = `user-gender fa fa-${genderMap[userInfo.gender || 1]}`;
    const [avatarLink, setAvatarLink] = useState(`${config.ossPublic.userPrefix}/default.jpg`);
    const avatarChangeHandler = () => {
        const jsonData = new FormData(document.querySelector('#avatarForm'));
        const successFunc = result => {
            stanLoading('hide');
            if (result.success) {
                stanAlert({
                    type: 'success',
                    content: result.message,
                    textAlign: 'center',
                    shownExpires: 0.75,
                });
                updateAvatarCount();
            } else {
                stanAlert({
                    title: 'Warning!',
                    content: result.message,
                });
            }
        };
        const failFunc = err => {
            stanLoading('hide');
            stanAlert({
                title: 'Warning!',
                content: 'connect to server failed, please try again later...',
            });
            console.info(err); // eslint-disable-line
        };
        const options = {
            cache: false,
            processData: false,
            contentType: false,
        };
        
        stanLoading();
        ajaxAction('user.updateAvatar', jsonData, successFunc, failFunc, options);
    };

    useEffect(() => {
        checkUserAvatar(userInfo.uuid, () => {
            const stamp = _count.avatar ? `?count=${_count.avatar}` : '';

            setAvatarLink(`${config.ossPublic.userPrefix}/${userInfo.uuid}.jpg${stamp}`);
        });
    }, [userInfo.uuid, _count.avatar]);

    return (
        <Col xs={ 12 } sm={ 12 } md={ 5 } lg={ 4 } className="user-overview">
            <div className="overview-wrap">
                <div className="avatar-wrap">
                    <form
                        id="avatarForm"
                        method="POST"
                        encType="multipart/form-data"
                    >
                        <img className="avatar" src={ avatarLink }/>
                        <label htmlFor="avatarInput" className="edit-icon-container">
                            <i className="fa fa-edit"></i>
                        </label>
                        <input
                            id="avatarInput"
                            type="file"
                            accept="image/jpg,image/jpeg,image/gif,image/png,image/bmp"
                            className="hidden"
                            onChange={ avatarChangeHandler }
                            name="file"
                        />
                    </form>
                </div>
                <div className="name-wrap">
                    <div className="user-name">
                        <i className={ genderClass }></i>
                        { userInfo.userName }
                    </div>
                    {
                        userInfo.isEnabled ? (
                            <div className="account-activated">
                                <span className="activated-tips activated">
                                    Activated
                                </span>
                            </div>
                        ) : (
                            <div className="account-activated">
                                <span className="send-activate-mail-link" onClick={ activateAccount }>
                                    click to activate account
                                </span>
                            </div>
                        )
                    }
                </div>
                <div className="operate-wrap">
                    <span className="operate-link" onClick={ toggleEditInfoModal }>
                        Edit Info
                    </span>
                    &nbsp;|&nbsp;
                    <span className="operate-link" onClick={ toggleEditPwdModal }>
                        Edit Pwd
                    </span>
                    &nbsp;|&nbsp;
                    <span className="operate-link" onClick={ resetPwd }>
                        Reset Pwd
                    </span>
                </div>
            </div>
        </Col>
    );
};
const UI_Profile = function(props) {
    const {
        isLogin,
        hasReqDefault,
        seo,
        userInfo,
        _count,
        updateAvatarCount,
        activateAccount,
        resetPwd,
        ajaxUpdateInfo,
        ajaxUpdatePwd,
    } = props;
    const processedSeo = {
        title: seo.title.replace('[name]', userInfo.userName || '<Stranger>'),
        description: seo.description,
        keywords: seo.keywords,
    };
    const [editInfoModalShow, setEditInfoModalShow] = useState(false);
    const [editPwdModalShow, setEditPwdModalShow] = useState(false);
    const toggleEditInfoModal = () => setEditInfoModalShow(!editInfoModalShow);
    const toggleEditPwdModal = () => setEditPwdModalShow(!editPwdModalShow);

    useEffect(() => {
        if (!isLogin && hasReqDefault) {
            stanAlert({
                type: 'danger',
                content: 'login session has been expired, please login first, going to home page now...',
                textAlign: 'center',
                shownExpires: 1,
                autoClose: false,
            });

            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLogin, hasReqDefault]);

    return (
        <>
            <TitleGenerator title={ processedSeo.title }/>
            <HeadGenerator seo={ processedSeo }>
                <meta name="robots" content="nofollow"/>
            </HeadGenerator>
            <Layout>
                <div className="page-profile">
                    <Navbar/>
                    <Row className="page-section-body">
                        <UserOverview
                            _count={ _count }
                            userInfo={ userInfo }
                            toggleEditInfoModal={ toggleEditInfoModal }
                            toggleEditPwdModal={ toggleEditPwdModal }
                            updateAvatarCount={ updateAvatarCount }
                            activateAccount={ activateAccount }
                            resetPwd={ resetPwd }
                        />
                        <UserInfo userInfo={ userInfo }/>
                        <UserAd/>
                        <UserComment/>
                    </Row>
                </div>
            </Layout>
            <EditInfoModal
                show={ editInfoModalShow }
                userInfo={ userInfo }
                toggleEditInfoModal={ toggleEditInfoModal }
                ajaxUpdateInfo={ ajaxUpdateInfo }
            />
            <EditPwdModal
                show={ editPwdModalShow }
                toggleEditPwdModal={ toggleEditPwdModal }
                ajaxUpdatePwd={ ajaxUpdatePwd }
            />
        </>
    );
};
const mapState2Props = (state, props) => Object.assign({}, state, props);
const mapDispatch2Props = dispatch => ({
    updateAvatarCount: () => dispatch(increaseCount('avatar')),
    activateAccount: () => {
        const successFunc = result => {
            if (result.success) {
                stanAlert({
                    type: 'success',
                    content: result.message,
                    textAlign: 'center',
                    shownExpires: 0.75,
                });
            } else {
                stanAlert({
                    title: 'Warning!',
                    content: result.message,
                });
            }
        };
        const failFunc = err => {
            stanAlert({
                title: 'Warning!',
                content: 'connect to server failed, please try again later...',
            });
            console.info(err); // eslint-disable-line
        };

        ajaxAction('user.sendActivateMail', {}, successFunc, failFunc);
    },
    resetPwd: () => {
        const ajaxLogout = () => {
            const logoutSuccessFunc = logoutResult => {
                stanLoading('hide');
                if (logoutResult.success === undefined) {
                    stanAlert({
                        type: 'danger',
                        textAlign: 'center',
                        content: 'something wrong happened in server side....',
                    });
                } else {
                    if (logoutResult.success) {
                        dispatch(logout(logoutResult.data));
                    }
                }
            };
            const logoutFailFunc = err => {
                stanLoading('hide');
                stanAlert({
                    title: 'Warning!',
                    type: 'danger',
                    textAlign: 'center',
                    content: 'wrong network connect, please try again later...',
                });
                console.error(err);  // eslint-disable-line
            };

            ajaxAction('user.logout', {}, logoutSuccessFunc, logoutFailFunc);
        };
        const successFunc = result => {
            if (result.success) {
                stanAlert({
                    type: 'success',
                    content: result.message,
                    textAlign: 'center',
                    shownExpires: 0.75,
                });

                setTimeout(() => {
                    ajaxLogout();
                }, 1500);
            } else {
                stanLoading('hide');
                stanAlert({
                    title: 'Warning!',
                    content: result.message,
                });
            }
        };
        const failFunc = err => {
            stanLoading('hide');
            stanAlert({
                title: 'Warning!',
                content: err.toString(),
            });
            console.info(err);  //  eslint-disable-line
        };

        stanLoading();
        ajaxAction('user.resetPwd', {}, successFunc, failFunc);
    },
    ajaxUpdateInfo: (jsonData, cbFunc) => {
        const successFunc = function(result) {
            if (result.success) {
                stanAlert({
                    type: 'success',
                    content: result.message,
                    textAlign: 'center',
                    shownExpires: 0.75,
                });

                cbFunc && cbFunc();
                dispatch(updateUserInfo(result.data));
            } else {
                stanAlert({
                    title: 'Warning!',
                    content: result.message,
                });
            }
        };
        const failFunc = function(err) {
            stanAlert({
                title: 'Warning!',
                content: err.toString(),
            });
            console.info(err);  //  eslint-disable-line
        };

        ajaxAction('user.updateInfo', jsonData, successFunc, failFunc);
    },
    ajaxUpdatePwd: (jsonData, cbFunc) => {
        const successFunc = result => {
            if (result.success) {
                stanAlert({
                    type: 'success',
                    content: result.message,
                    textAlign: 'center',
                    shownExpires: 0.75,
                });

                cbFunc && cbFunc();
                dispatch(updateUserInfo(result.data));
            } else {
                stanAlert({
                    title: 'Warning!',
                    content: result.message,
                });
            }
        };
        const failFunc = err => {
            stanAlert({
                title: 'Warning!',
                content: err.toString(),
            });
            console.info(err);  //  eslint-disable-line
        };

        ajaxAction('user.updatePwd', jsonData, successFunc, failFunc);
    },
});
let Profile;

EditPwdModal.propTypes = {
    show: PropTypes.bool,
    toggleEditPwdModal: PropTypes.func,
    ajaxUpdatePwd: PropTypes.func,
};
EditInfoModal.propTypes = {
    show: PropTypes.bool,
    userInfo: PropTypes.object,
    toggleEditInfoModal: PropTypes.func,
    ajaxUpdateInfo: PropTypes.func,
};
UserInfo.propTypes = {
    userInfo: PropTypes.object,
};
UserOverview.propTypes = {
    _count: PropTypes.object,
    userInfo: PropTypes.object,
    toggleEditInfoModal: PropTypes.func,
    toggleEditPwdModal: PropTypes.func,
    updateAvatarCount: PropTypes.func,
    activateAccount: PropTypes.func,
    resetPwd: PropTypes.func,
};
UI_Profile.propTypes = {
    _count: PropTypes.object,
    isLogin: PropTypes.bool,
    hasReqDefault: PropTypes.bool,
    seo: PropTypes.object,
    userInfo: PropTypes.object,
    updateAvatarCount: PropTypes.func,
    activateAccount: PropTypes.func,
    resetPwd: PropTypes.func,
    ajaxUpdateInfo: PropTypes.func,
    ajaxUpdatePwd: PropTypes.func,
};
Profile = connect(
    mapState2Props,
    mapDispatch2Props,
)(UI_Profile);
Profile.getInitialProps = async () => {
    const seoData = {
        pageName: 'profile',
    };
    const seoReq = getFetchUrl('util.seo', seoData);
    const seoRes = seoReq && await fetch(seoReq);
    const seoResult = seoRes && await seoRes.json();
    
    const initProps = {
        seo: seoResult.data,
    };

    return initProps;
};

export default withRouter(Profile);