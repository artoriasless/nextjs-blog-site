import React from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';

const stanLoading = hide => {
    const $root = document.querySelector('#root');
    const $dialogContainer = $root.querySelectorAll('.dialog')[0];
    const StanLoading = function() {
        return (
            <div className="stan-loading-container">
                <div className="stan-loading-content"></div>
            </div>
        );
    };

    if (hide !== undefined && hide) {
        setTimeout(() => {
            $('.stan-loading-container').fadeOut('normal', () => {
                $('.stan-loading-container').remove();
            });
        }, 500);
    } else {
        if ($('.stan-loading-container').length === 0) {
            ReactDOM.render(<StanLoading/>, $dialogContainer);
        }
    }
};

export default stanLoading;