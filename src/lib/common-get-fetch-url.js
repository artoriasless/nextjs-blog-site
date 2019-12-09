import config from 'config';

import { ajaxRequestMap } from './constant';

const getFetchUrl = (ajaxName, jsonData) => {
    /**
     * 通用的用于 getInitialProps 方法中，根据请求名，拼接请求链接的方法
     */
    const keyArr = ajaxName.split('.');
    let fetchObj = JSON.parse(JSON.stringify(ajaxRequestMap));

    keyArr.forEach(key => {
        fetchObj = fetchObj[key];
    });
    
    // 检查请求地址中是否有 param 参数需要替换
    const paramReg = /\/(:([^/]+))(\/|$)/;
    const paramRegResult = fetchObj.url.match(paramReg);

    if (paramRegResult) {
        const paramVariable = paramRegResult[1];
        const paramStr = paramRegResult[2];
        const paramKeyArr = paramStr.split('.');
        let paramValue = Object.assign({}, jsonData);

        paramKeyArr.forEach(key => {
            paramValue = paramValue[key];
        });

        fetchObj.url = fetchObj.url.replace(paramVariable, paramValue);
    }

    let fetchUrl;
    
    try {
        document.querySelector('#isBrowser');
        
        fetchUrl = `${config.domain}${fetchObj.url}`;
    } catch (err) { // eslint-disable-line
        fetchUrl = `http://127.0.0.1:${config.port}${fetchObj.url}`;
    }

    if (fetchUrl && fetchObj.type === 'GET') {
        const dataKeyArr = Object.keys(jsonData);

        dataKeyArr.forEach((key, idx) => {
            fetchUrl += `${idx === 0 ? '?' : '&'}${key}=${jsonData[key]}`;
        });
    }

    return fetchUrl;
};

export default getFetchUrl;