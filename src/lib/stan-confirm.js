import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import {
    Button,
    Modal,
} from 'react-bootstrap';

const stanConfirm = options => {
    /**
     *  通用的 alert 方法，警告内容支持 html 格式标签
     *  @param {object} [options] 相关参数、设定
     *      {string}  [title]     （必选）指定 confirm 内容的大标题
     *      {string}  [content]   （必选）指定 confirm 内容的正文
     *      {string}  [textAlign] （可选）指定 confirm 中主体内容的文案对齐方式，默认 left ，可传入值为 left/center/right
     *      {string}  [btnAlign]  （可选）指定 confirm 中操作按钮的对齐方式，默认 right ，可传入值为 left/center/right
     *      {object}  [confirm]   （必选）指定点击 confirm 后的回调方法
     *      {object}  [cancel]    （可选）指定点击 cancel 后的回调方法
     */
    const $root = document.querySelector('#root');
    const $dialogContainer = $root.querySelectorAll('.dialog')[0];
    const StanConfirm = function() {
        const alignMap = {
            'left': 'left',
            'center': 'center',
            'right': 'right',
        };
        const confirmTitle = options.title || '';
        const confirmContent = options.content || '';
        const textAlign = options.textAlign ? (alignMap[options.textAlign] || 'left') : 'left';
        const btnAlign = options.btnAlign ? (alignMap[options.btnAlign] || 'right') : 'right';
        const [show, setShow] = useState(true);
        const confirm = () => {
            setShow(false);
            options.confirm && options.confirm();
        };
        const cancel = () => {
            setShow(false);
            options.cancel && options.cancel();
        };

        return (
            <Modal
                className="common-modal confirm-modal"
                show={ show }
                onHide={ cancel }
                centered={ true }
            >
                <Modal.Header closeButton>
                    <Modal.Title className="confirm-title">
                        { confirmTitle }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className={ `confirm-content text-${textAlign}` }>
                    <div dangerouslySetInnerHTML={{ __html: confirmContent, }}></div>
                </Modal.Body>

                <Modal.Footer className={ btnAlign }>
                    <Button 
                        variant="default"
                        className="cancel-btn"
                        onClick={ cancel }
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="primary"
                        className="confirm-btn"
                        onClick={ confirm }
                    >
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    ReactDOM.render(<StanConfirm/>, $dialogContainer);
};

export default stanConfirm;