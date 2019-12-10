import React, { useState, useEffect, useRef, } from 'react';
import { withRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';
import PropTypes from 'prop-types';

import $ from 'jquery';
import {
    Modal,
    OverlayTrigger,
    Popover,
    Row,
    Col,
} from 'react-bootstrap';

import config from 'config';
import {
    getParams,
    getFetchUrl,
    stanAlert,
    stanLoading,
    markdown,
    selectContent,
    ajaxAction,
} from 'lib';
import {
    TitleGenerator,
    HeadGenerator,
    Layout,
    Navbar,
    LoginModal,
} from 'components';

import 'style/pages/paper-submit.scss';

const submitValidate = (submitType, formData) => {
    const title = 'Warning!';
    const alertInfo = {
        id: {
            null: 'paper id can\'t be null while editing paper!',
            illegal: 'paper id must be digital value!',
        },
        title: {
            null: 'paper title can\'t be null!',
        },
        tag: {
            null: 'paper tag can\'t be null!',
        },
        brief: {
            null: 'paper brief can\'t be null!',
        },
        content: {
            null: 'paper content can\'t be null!',
        },
    };

    if (submitType === 'EDIT') {
        if (!formData.id) {
            stanAlert({
                title,
                content: alertInfo.id.null,
            });

            return false;
        }
        if (isNaN(Number(formData.id))) {
            stanAlert({
                title,
                content: alertInfo.id.illegal,
            });

            return false;
        }
    }

    if (!formData.title) {
        stanAlert({
            title,
            content: alertInfo.title.null,
        });

        return false;
    }

    if (!formData.tag) {
        stanAlert({
            title,
            content: alertInfo.tag.null,
        });

        return false;
    }

    if (!formData.brief) {
        stanAlert({
            title,
            content: alertInfo.brief.null,
        });

        return false;
    }

    if (!formData.content) {
        stanAlert({
            title,
            content: alertInfo.content.null,
        });

        return false;
    }

    return true;
};

const UploadModal = function(props) {
    const {
        show,
        toggleUploadModal,
    } = props;
    const [history, setHistory] = useState([]);
    const changeHandler = () => {
        const jsonData = new FormData(document.querySelector('#uploadForm'));
        const successFunc = function(result) {
            stanLoading('hide');
            if (result.success) {
                const newHistory = history.slice(0);

                newHistory.push({
                    originalFileName: result.data.originalFileName,
                    fileName: result.data.fileName
                });
                setHistory(newHistory);
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
        const failFunc = function(err) {
            stanLoading('hide');
            stanAlert({
                title: 'Warning!',
                content: err.toString(),
            });
            console.info(err); // eslint-disable-line
        };
        const options = {
            cache: false,
            processData: false,
            contentType: false,
        };

        stanLoading();
        ajaxAction('paper.uploadMaterial', jsonData, successFunc, failFunc, options);
    };

    useEffect(() => {
        $('body').on('click', '.cdn-info-wrap', function(evt) {
            selectContent(evt.target);
        });
    }, []);

    return (
        <Modal
            id="uploadModal"
            centered={ true }
            show={ show } 
            onHide={ toggleUploadModal }
            className="common-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Upload File(s)/Image(s)
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="upload-form">
                    <form
                        id="uploadForm"
                        method="POST"
                        encType="multipart/form-data"
                    >
                        <label htmlFor="uploadInput" className="upload-icon-container">
                            <i className="fa fa-file"></i>
                        </label>
                        <input
                            id="uploadInput"
                            type="file"
                            accept="*"
                            className="hidden"
                            onChange={ changeHandler }
                            name="file"
                        />
                    </form>
                </div>
                <div className="upload-history">
                    <div className="history-title">
                        Upload History
                    </div>
                    <ul className="history-list">
                        {
                            history.map((item, index) => (
                                <li className="history-item" key={ item.fileName + index }>
                                    <div className="original-name">
                                        { item.originalFileName }
                                    </div>
                                    <OverlayTrigger trigger="click" placement="left" overlay={
                                        <Popover>
                                            <Popover.Content className="cdn-info-wrap">
                                                { `${config.ossPublic.domain}/${item.fileName}` }
                                            </Popover.Content>
                                        </Popover>
                                    }>
                                        <div className="cdn-info-link">
                                            <i className="fa fa-link"></i>
                                        </div>
                                    </OverlayTrigger>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </Modal.Body>
        </Modal>
    );
};
const PaperEditForm = function(props) {
    const {
        paperForm,
        setPaperForm,
    } = props;
    const $paperBrief = useRef(null);
    const $paperContent = useRef(null);
    const formChangeHandler = (evt, key) => {
        const originalPaperForm = JSON.parse(JSON.stringify(paperForm));
        let val = evt.target.value || '';

        if (key !== 'brief' && key !== 'content') {
            val = val.trim();
        }

        originalPaperForm[key] = val;
        setPaperForm(originalPaperForm);
    };

    useEffect(() => {
        if (paperForm.brief && paperForm.brief !== $paperBrief.current.value) {
            $paperBrief.current.value = paperForm.brief;
        }

        if (paperForm.content && paperForm.content !== $paperContent.current.value) {
            $paperContent.current.value = paperForm.content;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Col xs={ 12 } sm={ 12 } md={ 6 } lg={ 6 } className="form-container ">
            <form className="form-content">
                <div className="form-group">
                    <input
                        id="paper_title"
                        className="form-control"
                        type="text"
                        placeholder="type paper title"
                        defaultValue={ paperForm.title }
                        onChange={ event => formChangeHandler(event, 'title') }
                    />
                </div>
                <div className="form-group">
                    <input
                        id="paper_tag"
                        className="form-control"
                        type="text"
                        placeholder="type paper tag"
                        defaultValue={ paperForm.tag }
                        onChange={ event => formChangeHandler(event, 'tag') }
                    />
                </div>
                <div className="form-group">
                    <input
                        id="paper_subtag"
                        className="form-control"
                        type="text"
                        placeholder="type paper subtag(s)(splited by Chinese comma '，' between subtags)"
                        defaultValue={ paperForm.subtag }
                        onChange={ event => formChangeHandler(event, 'subtag') }
                    />
                </div>
                <div className="form-group">
                    <textarea
                        id="paper_brief"
                        className="form-control"
                        placeholder="type paper brief(one paragraph is enough)"
                        onChange={ event => formChangeHandler(event, 'brief') }
                        ref={ $paperBrief }
                    ></textarea>
                </div>
                <div className="form-group paper-content-container">
                    <textarea
                        id="paper_content"
                        className="form-control"
                        placeholder="type paper content(only support markdown syntax)"
                        onChange={ event => formChangeHandler(event, 'content') }
                        ref={ $paperContent }
                    ></textarea>
                </div>
            </form>
        </Col>
    );
};
const PaperEditPreview = function(props) {
    const paperForm = props.paperForm;
    const paperBody = markdown(paperForm.content || '');

    return (
        <Col xs={ 12 } sm={ 12 } md={ 6 } lg={ 6 } className="preview-container">
            <div className="preview-content">
                <div className="preview-paper" dangerouslySetInnerHTML={{ __html: paperBody }}></div>
            </div>
        </Col>
    );
};
const PaperSubmit = function(props) {
    const {
        seo,
        paper,
        pageType,
    } = props;
    const operateMap = {
        editing: 'preview',
        preview: 'editing',
    };
    const [operate, setOperate] = useState('editing');
    const [uploadModalShow, setUploadModalShow] = useState(false);
    const [paperForm, setPaperForm] = useState({
        paperId: paper.id || 0,
        title: paper.title || '',
        tag: paper.tag || '',
        subtag: paper.subtag || '',
        brief: paper.brief || '',
        content: paper.content || '',
    });
    const toggleEditPreview = () => setOperate(operateMap[operate] || 'editing');
    const toggleUploadModal = () => setUploadModalShow(!uploadModalShow);
    const savePaper = () => {
        const jsonData = Object.assign({}, paperForm);
        const successFunc = result => {
            if (result.success) {
                stanAlert({
                    type: 'success',
                    content: result.message,
                    textAlign: 'center',
                    shownExpires: 0.75,
                });

                setTimeout(function() {
                    window.location.href = '/catalogue/all/1';
                }, 2000);
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
                content: 'connect to server failed, please try again later...',
            });
            console.info(err);  //  eslint-disable-line
        };
        let reqName;

        jsonData.title = jsonData.title.trim();
        jsonData.tag = jsonData.tag.trim();
        jsonData.subtag = jsonData.subtag.trim();
        jsonData.brief = jsonData.brief.trim();
        jsonData.content = jsonData.content.trim();

        if (submitValidate(pageType, jsonData)) {
            switch(pageType) {
            case 'ADD':
                reqName = 'paper.create';
                break;
            case 'EDIT':
                reqName = 'paper.update';
                break;
            default:
                // de nothing
            }

            ajaxAction(reqName, jsonData, successFunc, failFunc);
        }
    };

    useEffect(() => {
        setPaperForm({
            id: paper.id || 0,
            title: paper.title || '',
            tag: paper.tag || '',
            subtag: paper.subtag || '',
            brief: paper.brief || '',
            content: paper.content || '',
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paper.id]);

    return (
        <>
            <TitleGenerator title={ seo.title }/>
            <HeadGenerator seo={ seo }>
                <meta name="robots" content="nofollow"/>
            </HeadGenerator>
            <Layout>
                <div className="page-paper-submit">
                    <Navbar/>
                    <Row className={ `page-section-body ${operate}` }>
                        <span className={ `toggle-edit-preview ${operate}` } onClick={ toggleEditPreview }>
                            <i className="fa fa-edit"></i>
                            <i className="fa fa-eye"></i>
                        </span>
                        <span className="show-upload-modal-link" onClick={ toggleUploadModal }>
                            <i className="fa fa-upload"></i>
                        </span>
                        <span className="submit-paper-link" onClick={ savePaper }>
                            <i className="fa fa-save"></i>
                        </span>
                        <PaperEditForm paperForm={ paperForm } setPaperForm={ setPaperForm }/>
                        <PaperEditPreview paperForm={ paperForm }/>
                    </Row>
                </div>
            </Layout>
            <LoginModal/>
            <UploadModal show={ uploadModalShow } toggleUploadModal={ toggleUploadModal }/>
        </>
    );
};

UploadModal.propTypes = {
    show: PropTypes.bool,
    toggleUploadModal: PropTypes.func,
};
PaperEditPreview.propTypes = {
    paperForm: PropTypes.object,
};
PaperEditForm.propTypes = {
    paperForm: PropTypes.object,
    setPaperForm: PropTypes.func,
};
PaperSubmit.propTypes = {
    seo: PropTypes.object,
    paper: PropTypes.object,
    pageType: PropTypes.string,
};
PaperSubmit.getInitialProps = async ctx => {
    const {
        id,
    } = getParams(ctx);

    const seoData = {
        pageName: 'paperSubmit',
    };
    const seoReq = getFetchUrl('util.seo', seoData);
    const seoRes = seoReq && await fetch(seoReq);
    const seoResult = seoRes && await seoRes.json();

    const paperData = {
        paperId: id,
    };
    let paperReq;
    let paperRes;
    let paperResult;
    let paper = {};
    let pageType = 'ADD';

    if (Number(id) !== 0) {
        paperReq = getFetchUrl('paper.detail', paperData);
        paperRes = paperReq && await fetch(paperReq);
        paperResult = paperRes && await paperRes.json();
        paper = paperResult.data || {};
        pageType = 'EDIT';
    }
    
    const initProps = {
        seo: seoResult.data,
        paper,
        pageType,
    };

    return initProps;
};

export default withRouter(PaperSubmit);