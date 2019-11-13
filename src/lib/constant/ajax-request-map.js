const GET = 'GET';
const POST = 'POST';
const ajaxRequestMap = {
    user: {
        default: {
            url: '/api/user/default', type: GET,
        },
        login: {
            url: '/api/user/login', type: POST,
        },
        logout: {
            url: '/api/user/logout', type: POST,
        },
        register: {
            url: '/api/user/register', type: POST,
        },
        sendActivateMail: {
            url: '/api/user/send-activate-mail', type: POST
        },
        activate: {
            url: '/api/user/activate', type: POST
        },
        updateInfo: {
            url: '/api/user/update-info', type: POST
        },
        updatePwd: {
            url: '/api/user/update-pwd', type: POST
        },
        resetPwd: {
            url: '/api/user/reset-pwd', type: POST
        },
    }
};

export default ajaxRequestMap;