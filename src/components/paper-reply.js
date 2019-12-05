import React, { useState, useEffect, useRef, } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
    Button,
    Modal,
} from 'react-bootstrap';

import config from 'config';
import {
    ajaxAction,
    stanAlert,
    stanConfirm,
} from 'lib';
import {
    toggleHidden,
} from 'actions';

const submitValidate = reply => {
    const alertInfo = {
        title: 'Warning!',
        content: {
            null: 'please type the comment!',
        },
    };

    if (!reply.content) {
        stanAlert({
            title: alertInfo.title,
            content: alertInfo.content.null,
        });

        return false;
    }

    return true;
};

const getReply = (paperId, cbFunc) => {
    const jsonData = {
        paperId,
    };
    const successFunc = function(result) {
        if (result.success) {
            cbFunc && cbFunc(result);
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
        console.info(err); // eslint-disable-line
    };

    ajaxAction('reply.list', jsonData, successFunc, failFunc);
};
const addReply = (replyForm, cbFunc) => {
    const jsonData = Object.assign({}, replyForm);
    const successFunc = function(result) {
        if (result.success) {
            cbFunc && cbFunc(result);
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

    jsonData.content = jsonData.content.trim();

    ajaxAction('reply.create', jsonData, successFunc, failFunc);
};
const updateReply = (replyForm, cbFunc) => {
    const jsonData = Object.assign({}, replyForm);
    const successFunc = function(result) {
        if (result.success) {
            cbFunc && cbFunc(result);
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

    jsonData.content = jsonData.content.trim();
    
    ajaxAction('reply.update', jsonData, successFunc, failFunc);
};
const deleteReply = (replyForm, cbFunc) => {
    const jsonData = Object.assign({}, replyForm);
    const successFunc = function(result) {
        if (result.success) {
            cbFunc && cbFunc(result);
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
        console.info(err); // eslint-disable-line
    };

    ajaxAction('reply.delete', jsonData, successFunc, failFunc);
};

const ReplyModal = function(props) {
    const {
        toggleReplyModal,
        replyForm,
        setReplyForm,
        _hidden,
        submitForm,
    } = props;
    const operate = replyForm.replyType === 'EDIT' ? 'Update' : 'Add';
    const $replyInput = useRef(null);
    const formChangeHandler = evt => { // eslint-disable-line
        const FormData = Object.assign({}, replyForm);

        FormData.content = evt.target.value;
        setReplyForm(FormData);
    };
    const submitReply = () => {
        toggleReplyModal();
        submitForm(replyForm);
    };

    useEffect(() => {
        if (replyForm.replyType === 'ADD' || replyForm.replyType === 'EDIT') {
            $replyInput.current.value = replyForm.content;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [replyForm]);

    return (
        <Modal
            id="replyModal"
            className="common-modal"
            show={ !_hidden.replyModal }
            onHide={ toggleReplyModal }
            centered={ true }
        >
            <Modal.Header closeButton>
                <Modal.Title className="confirm-title">
                    { operate } Your Comment
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <form id="replyForm">
                    <textarea
                        id="replyInput"
                        name="content"
                        placeholder="please type your comment here..."
                        ref={ $replyInput }
                        onChange={ formChangeHandler }
                    ></textarea>
                </form>
            </Modal.Body>

            <Modal.Footer>
                <Button 
                    variant="primary"
                    className="submit-btn"
                    onClick={ submitReply }
                >
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
const ReplyList = function(props) {
    const {
        reply,
        manageReply,
        userInfo,
    } = props;
    const addReply = replyItem => {
        if (replyItem === null) {
            manageReply({
                paperId: reply.paperId,
                rootReplyId: 0,
                replyId: 0,
                replyLevel: 0,
                replyType: 'ADD',
                content: '',
            });
        } else {
            manageReply({
                paperId: reply.paperId,
                rootReplyId: replyItem.rootReplyId,
                replyId: replyItem.id,
                replyLevel: replyItem.replyLevel + 1,
                replyType: 'ADD',
                content: '',
            });
        }
    };
    const editReply = replyItem => {
        manageReply({
            paperId: reply.paperId,
            id: replyItem.id,
            replyType: 'EDIT',
            content: replyItem.content,
        });
    };
    const deleteReply = replyItem => {
        manageReply({
            paperId: reply.paperId,
            id: replyItem.id,
            replyType: 'DELETE',
            content: replyItem.content,
        });
    };
    const avatarErrHandler = evt => {
        const $userAvatar = evt.target;
        const defaultAvatarLink = `${config.ossPublic.userPrefix}/default.jpg`;

        $userAvatar.setAttribute('src', defaultAvatarLink);
    };

    if (reply.replyList.length === 0) {
        return (
            <dl className="reply-container">
                <dt className="reply-title">
                    Comments
                    <span className="reply-operate reply" onClick={ () => addReply(null) }>
                        <i className="fa fa-reply"></i>
                    </span>
                </dt>
                <dd className="no-reply-tips">
                    no comment now, be the first to reply
                </dd>
            </dl>
        );
    } else {
        const replyId2IdxMap = {};
        const userId2NameMap = {};

        reply.replyList.forEach((replyItem, index) => {
            replyItem.editTag = (replyItem.userInfo.uuid === userInfo.uuid) && !replyItem.isDeleted;

            replyId2IdxMap[replyItem.id] = index;

            if (userId2NameMap[replyItem.userInfo.id] === undefined) {
                userId2NameMap[replyItem.userInfo.id] = replyItem.userInfo.userName;
            }

            return replyItem;
        });
        
        return (
            <dl className="reply-container">
                <dt className="reply-title">
                    Comments
                    <span className="reply-operate reply" onClick={ () => addReply(null) }>
                        <i className="fa fa-reply"></i>
                    </span>
                </dt>
                {
                    reply.replyList.map((replyItem, index) => {
                        const key = `replyItem_${index}`;
                        const avatarSrc = `${config.ossPublic.userPrefix}/${replyItem.userInfo.uuid}.jpg`;
                        const userName = replyItem.userInfo.userName;
                        const replyContent = replyItem.isDeleted === 0 ? replyItem.content : 'x this reply has been deleted';
                        const replyDate = replyItem.replyDate;
                        const replyToTag = replyItem.replyLevel !== 0;
                        const replyTo = replyItem.replyLevel !== 0 ?
                            userId2NameMap[reply.replyList[replyId2IdxMap[replyItem.replyId]].userInfo.id] :
                            '';
                        const ownerTag = replyItem.userInfo.uuid === userInfo.uuid &&
                            userInfo.uuid !== undefined;
                        const canDeleteTag = ownerTag && replyItem.isDeleted === 0;
                        const canEditTag = canDeleteTag;
                        const canReplyTag = replyItem.isDeleted === 0;

                        return (
                            <dd
                                className={ `reply-item reply-level-${replyItem.replyLevel}` }
                                key={ key }
                                data-id={ replyItem.id }
                                data-level={ replyItem.replyLevel }
                                data-root={ replyItem.rootReplyId }
                            >
                                <div className="user-info">
                                    <div className="user-avatar">
                                        <img
                                            className="avatar-img"
                                            src={ avatarSrc }
                                            onError={ avatarErrHandler }
                                        />
                                    </div>
                                    <div className="user-name">
                                        { userName }
                                        <i className={ replyToTag ? 'fa fa-share' : '' }></i>
                                        { replyTo }
                                    </div>
                                </div>
                                <div className={ `reply-content ${replyItem.isDeleted === 0 ? '' : 'deleted'}` }>
                                    { replyContent }
                                </div>
                                <div className="reply-addition">
                                    <div className="reply-date pull-left">
                                        { replyDate }
                                    </div>
                                    <div className="reply-operate-container pull-right">
                                        {
                                            canDeleteTag ? (
                                                <span className="reply-operate delete" onClick={ () => deleteReply(replyItem) }>
                                                    <i className="fa fa-times"></i>
                                                </span>
                                            ) : null
                                        }
                                        {
                                            canEditTag ? (
                                                <span className="reply-operate edit" onClick={ () => editReply(replyItem) }>
                                                    <i className="fa fa-edit"></i>
                                                </span>
                                            ) : null
                                        }
                                        {
                                            canReplyTag ? (
                                                <span className="reply-operate reply" onClick={ () => addReply(replyItem) }>
                                                    <i className="fa fa-reply"></i>
                                                </span>
                                            ) : null
                                        }
                                    </div>
                                </div>
                            </dd>
                        );
                    })
                }
            </dl>
        );
    }
};
const UI_PaperReply = function(props) {
    const {
        isLogin,
        paperId,
        replyList,
        userInfo,
        showLoginModal,
        toggleReplyModal,
        _hidden,
    } = props;
    const [reply, setReply] = useState({
        paperId,
        replyList: [],
    });
    const [replyForm, setReplyForm] = useState({});
    const submitCB = () => {
        getReply(paperId, result => {
            setReply({
                paperId,
                replyList: result.data || [],
            });
        });
    };
    const submitForm = formData => {
        if (submitValidate(formData)) {
            switch(formData.replyType) {
            case 'ADD':
                addReply(formData, submitCB);
                break;
            case 'EDIT':
                updateReply(formData, submitCB);
                break;
            case 'DELETE':
                deleteReply(formData, submitCB);
                break;
            default:
                // do nothing
            }
        }
    };
    const manageReply = formData => {
        if (isLogin) {
            setReplyForm(formData);

            switch(formData.replyType) {
            case 'ADD':
                toggleReplyModal();
                break;
            case 'EDIT':
                toggleReplyModal();
                break;
            case 'DELETE':
                stanConfirm({
                    title: 'Delete Confirm',
                    content: `are you sure to delete this reply : <br/> <strong>${formData.content}</strong>`,
                    confirm: () => submitForm(formData),
                });
                break;
            default:
                // do nothing
            }
        } else {
            stanAlert({
                type: 'danger',
                textAlign: 'center',
                content: 'Guest,please login first...',
                shownExpires: 1.5,
            });

            setTimeout(() => {
                showLoginModal();
            }, 1500);
        }
    };

    useEffect(() => {
        setReply({
            paperId,
            replyList,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paperId]);

    return (
        <>
            <ReplyList
                reply={ reply }
                userInfo={ userInfo }
                manageReply={ manageReply }
                toggleReplyModal={ toggleReplyModal }
            />
            <ReplyModal
                toggleReplyModal={ toggleReplyModal }
                setReplyForm={ setReplyForm }
                replyForm={ replyForm }
                _hidden={ _hidden }
                submitForm={ submitForm }
            />
        </>
    );
};
const mapState2Props = state => state;
const mapDispatch2Props = dispatch => ({
    showLoginModal: () => dispatch(toggleHidden('loginModal')),
    toggleReplyModal: () => dispatch(toggleHidden('replyModal')),
});
let PaperReply;

ReplyModal.propTypes = {
    toggleReplyModal: PropTypes.func,
    replyForm: PropTypes.object,
    setReplyForm: PropTypes.func,
    _hidden: PropTypes.object,
    submitForm: PropTypes.func,
};
ReplyList.propTypes = {
    reply: PropTypes.object,
    manageReply: PropTypes.func,
    userInfo: PropTypes.object,
};
UI_PaperReply.propTypes = {
    isLogin: PropTypes.bool,
    paperId: PropTypes.number,
    replyList: PropTypes.array,
    userInfo: PropTypes.object,
    showLoginModal: PropTypes.func,
    toggleReplyModal: PropTypes.func,
    _hidden: PropTypes.object,
};
PaperReply = connect(
    mapState2Props,
    mapDispatch2Props,
)(UI_PaperReply);

export default PaperReply;