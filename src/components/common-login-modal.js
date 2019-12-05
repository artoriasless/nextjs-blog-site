import React, { useState, } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Modal,
    Button,
    Tabs,
    Tab,
} from 'react-bootstrap';

import {
    ajaxAction,
    stanAlert,
} from 'lib';
import {
    login,
    register,
    toggleHidden,
} from 'actions';

const submitValidate = (formData, type) => {
    const emailReg = /^[^@]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/;
    const pwdReg = /^\S{10,18}$/;
    const alertInfo = {
        title: 'Warning!',
        email: {
            null: 'Please type the email address!',
            illegal: 'Please type legal email address!',
        },
        password: {
            null: 'Please type the password!',
            illegal: 'Please type legal password! Password length must be from 10 to 16.',
        },
        confirmPwd: {
            null: 'Please retype the password to check!',
            illegal: 'The password to confirm is inconsistent!',
        },
    };

    if (!formData.email) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.email.null,
        });

        return false;
    } else if (!emailReg.test(formData.email)) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.email.illegal,
        });

        return false;
    } else if (!formData.password) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.password.null,
        });

        return false;
    } else if (!pwdReg.test(formData.password)) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.password.illegal,
        });

        return false;
    }
    //  如果是注册，需要再校验确认的模态框
    if (type === 'register') {
        if (!formData.confirmPwd) {
            stanAlert({
                title: alertInfo.title,
                content: alertInfo.confirmPwd.null,
            });

            return false;
        } else if (formData.password !== formData.confirmPwd) {
            stanAlert({
                title: alertInfo.title,
                content: alertInfo.confirmPwd.illegal,
            });

            return false;
        }
    }

    return true;
};
const resetPwdValidate = email => {
    const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    const alertInfo = {
        title: 'Warning!',
        email: {
            null: 'please type the email address!',
            illegal: 'please type legal email address!',
        },
    };

    if (!email) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.email.null
        });

        return false;
    } else if (!emailReg.test(email)) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.email.illegal,
        });

        return false;
    }

    return true;
};

const UI_LoginModal = function(props) {
    const {
        isLogin,
        _hidden,
        hideLoginModal,
        ajaxLogin,
        ajaxRegister,
    } = props;
    const [submitType, setSubmitType] = useState('login');
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });
    const [registerForm, setRegisterForm] = useState({
        email: '',
        password: '',
        confirmPwd: '',
    });
    const registerFormChangeHandler = (evt, key) => {
        const val = (evt.target.value || '').trim();
        const originalRegisterForm = JSON.parse(JSON.stringify(registerForm));

        originalRegisterForm[key] = val;
        setRegisterForm(originalRegisterForm);
    };
    const loginFormChangeHandler = (evt, key) => {
        const val = (evt.target.value || '').trim();
        const originalLoginForm = JSON.parse(JSON.stringify(loginForm));

        originalLoginForm[key] = val;
        setLoginForm(originalLoginForm);
    };
    const enterHandler = evt => {
        if (evt.keyCode === 13) {
            evt.target.blur();
            submitForm();
        }
    };
    const ajaxResetPwd = () => {
        const jsonData = {
            email: loginForm.email || ''
        };
        const successFunc = result => {
            if (result.success === undefined) {
                stanAlert({
                    type: 'danger',
                    textAlign: 'center',
                    content: 'something wrong happened in server side....',
                });
            } else {
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
                content: 'wrong network connect, please try again later...',
            });
            console.info(err);  //  eslint-disable-line
        };

        if (resetPwdValidate(jsonData.email)) {
            ajaxAction('user.resetPwd', jsonData, successFunc, failFunc);
        }
    };
    const submitForm = () => {
        switch(submitType) {
        case 'login':
            if (submitValidate(loginForm, 'login')) {
                ajaxLogin(loginForm);
            }
            break;
        case 'register':
            if (submitValidate(registerForm, 'register')) {
                ajaxRegister(registerForm);
            }
            break;
        }
    };

    if (isLogin) {
        return null;
    }

    return (
        <Modal
            id="loginModal"
            centered={ true }
            show={ !_hidden.loginModal } 
            onHide={ hideLoginModal }
            className="common-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Sign in or Sign up
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Tabs activeKey={ submitType } onSelect={ tabName => setSubmitType(tabName) }>
                    <Tab eventKey="login" title="Login">
                        <form id="loginForm">
                            <div className="form-group">
                                <label htmlFor="login_email">
                                    email
                                </label>
                                <input
                                    id="login_email"
                                    className="form-control"
                                    type="email"
                                    placeholder="type your email"
                                    onChange={ event => loginFormChangeHandler(event, 'email') }
                                    onKeyDown={ event => enterHandler(event) }
                                />
                            </div>
                            <div className="form-group">
                                <div>
                                    <label htmlFor="login_password">
                                        password
                                    </label>
                                    <span className="reset-pwd-link" onClick={ ajaxResetPwd }>
                                        forget pwd?
                                    </span>
                                </div>
                                <input
                                    id="login_password"
                                    className="form-control"
                                    type="password"
                                    placeholder="type your password"
                                    onChange={ event => loginFormChangeHandler(event, 'password') }
                                    onKeyDown={ event => enterHandler(event) }
                                />
                            </div>
                        </form>
                    </Tab>
                    <Tab eventKey="register" title="Register">
                        <form id="registerForm">
                            <div className="form-group">
                                <label htmlFor="register_email">
                                    email
                                </label>
                                <input
                                    id="register_email"
                                    className="form-control"
                                    type="email"
                                    placeholder="type your email"
                                    onChange={ event => registerFormChangeHandler(event, 'email') }
                                    onKeyDown={ event => enterHandler(event) }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="register_password">
                                    password
                                </label>
                                <input
                                    id="register_password"
                                    className="form-control"
                                    type="password"
                                    placeholder="type your password"
                                    onChange={ event => registerFormChangeHandler(event, 'password') }
                                    onKeyDown={ event => enterHandler(event) }
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="register_confirmPwd">
                                    password
                                </label>
                                <input
                                    id="register_confirmPwd"
                                    className="form-control"
                                    type="password"
                                    placeholder="confirm your password"
                                    onChange={ event => registerFormChangeHandler(event, 'confirmPwd') }
                                    onKeyDown={ event => enterHandler(event) }
                                />
                            </div>
                        </form>
                    </Tab>
                </Tabs>
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
const mapState2Props = state => state;
const mapDispatch2Props = dispatch => ({
    hideLoginModal: () => dispatch(toggleHidden('loginModal')),
    ajaxLogin: loginForm => {
        const jsonData = loginForm;
        const successFunc = result => {
            if (result.success === undefined) {
                stanAlert({
                    type: 'danger',
                    textAlign: 'center',
                    content: 'something wrong happened in server side....',
                });
            } else {
                if (result.success) {
                    dispatch(login(result.data));
                    dispatch(toggleHidden('loginModal'));
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

        ajaxAction('user.login', jsonData, successFunc, failFunc);
    },
    ajaxRegister: registerForm => {
        const jsonData = registerForm;
        const successFunc = result => {
            if (result.success === undefined) {
                stanAlert({
                    type: 'danger',
                    textAlign: 'center',
                    content: 'something wrong happened in server side....',
                });
            } else {
                if (result.success) {
                    dispatch(register(result.data));
                    dispatch(toggleHidden('loginModal'));
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

        ajaxAction('user.register', jsonData, successFunc, failFunc);
    },
});
let CommonLoginModal;

UI_LoginModal.propTypes = {
    isLogin: PropTypes.bool,
    _hidden: PropTypes.object,
    hideLoginModal: PropTypes.func,
    ajaxLogin: PropTypes.func,
    ajaxRegister: PropTypes.func,
};
CommonLoginModal = connect(
    mapState2Props,
    mapDispatch2Props,
)(UI_LoginModal);

export default CommonLoginModal;