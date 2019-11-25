const getParams = ({ isServer, pathname, asPath, query, }) => {
    /**
     * 通用的获取 URL 中 params 参数对象的方法
     */
    const params = {};
    const queryStr = asPath.split('?')[1] || '';

    queryStr.split('&').forEach(queryParam => {
        const [
            paramName = '',
            paramVal = '',
        ] = queryParam.split('=');

        params[paramName] = paramVal;
    });

    if (isServer) {
        const pathArr = pathname.split('/');
        const asPathArr = asPath.split('/');
        let key;

        pathArr.forEach((item, idx) => {
            if (/^\[([^[\]]+)\]$/.test(item)) {
                key = item.slice(1, -1);
                params[key] = asPathArr[idx];
            }
        });

        return params;
    }

    return query;
};

export default getParams;