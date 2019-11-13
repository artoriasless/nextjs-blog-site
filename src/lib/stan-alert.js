import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import {
    Alert,
} from 'react-bootstrap';

const stanAlert = options => {
    /**
     *  通用的 alert 方法，警告内容支持 html 格式标签
     *  @param {object} [options] （可选）相关参数、设定
     *      {string}  [type]         （可选）指定 alert 类型：默认为 danger
     *      {string}  [title]        （可选）指定 alert 内容的小标题
     *      {string}  [content]      （可选）指定 alert 内容的正文
     *      {boolean} [autoClose]    （可选）指定 alert 是否自动隐藏，默认 true ，传入的参数会被类型转换
     *      {number}  [shownExpires] （可选）指定 alert 多少秒后自动隐藏，默认 2 秒，若传入的 autoClose 为 false ，此参数将不生效
     *      {string}  [textAlign]    （可选）指定 alert 内容的文字对齐方式，默认 left
     */
    const $root = document.querySelector('#root');
    const $dialogContainer = $root.querySelectorAll('.dialog')[0];
    const StanAlert = function() {
        const typeMap = {
            'primary': 'primary',
            'secondary': 'secondary',
            'info': 'info',
            'danger': 'danger',
            'warning': 'warning',
            'success': 'success',
            'dark': 'dark',
            'light': 'light',
        };
        const alignMap = {
            'left': 'left',
            'center': 'center',
            'right': 'right',
        };
        const alertType = options.type ? (typeMap[options.type] || 'danger') : 'danger';
        const autoClose = Boolean((options.autoClose === undefined) ? true : options.autoClose);
        const alertTitle = options.title ? options.title : '';
        const alertContent = options.content || '';
        const shownExpires = Number((options.shownExpires === undefined) ? 2 : options.shownExpires);
        const textAlign = options.textAlign ? (alignMap[options.textAlign] || 'left') : 'left';
        const [show, setShow] = useState(true);

        useEffect(() => {
            if (autoClose) {
                setTimeout(() => {
                    setShow(false);
                }, shownExpires * 1000);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        if (show) {
            return (
                <div className="stan-alert-container">
                    <Alert 
                        variant={ alertType }
                        onClose={ () => setShow(false) } 
                        dismissible={ !autoClose }
                    >
                        {
                            alertTitle === '' ? null : (
                                <Alert.Heading className="alert-title">
                                    { alertTitle }
                                </Alert.Heading>
                            )
                        }
                        <div className={ `alert-content text-${textAlign}`}>
                            { alertContent }
                        </div>
                    </Alert>
                </div>
            );
        }
        
        return null;
    };

    ReactDOM.render(<StanAlert/>, $dialogContainer);
};

export default stanAlert;