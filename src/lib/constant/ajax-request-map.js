const GET = 'GET';
const POST = 'POST';
const ajaxRequestMap = {
    util: {
        seo: {
            url: '/api/util/seo', type: GET,
        },
    },
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
        activate: {
            url: '/api/user/activate', type: POST,
        },
        updateInfo: {
            url: '/api/user/update-info', type: POST,
        },
        updatePwd: {
            url: '/api/user/update-pwd', type: POST,
        },
        updateAvatar: {
            url: '/api/user/update-avatar', type: POST,
        },
        resetPwd: {
            url: '/api/user/reset-pwd', type: POST,
        },
        sendActivateMail: {
            url: '/api/user/send-activate-mail', type: POST,
        },
    },
    paper: {
        filterCount: {
            url: '/api/paper/filter-count', type: GET,
        },
        detail: {
            url: '/api/paper/:paperId', type: GET,
        },
        create: {
            url: '/api/paper/create', type: POST,
        },
        update: {
            url: '/api/paper/:paperId/update', type: POST,
        },
        uploadMaterial: {
            url: '/api/paper/upload-material', type: POST,
        },
    },
    catalogue: {
        page: {
            url: '/api/catalogue/page', type: GET,
        },
    },
    reply: {
        list: {
            url: '/api/reply', type: GET,
        },
        create: {
            url: '/api/reply/create', type: POST,
        },
        update: {
            url: '/api/reply/:id/update', type: POST,
        },
        delete: {
            url: '/api/reply/:id/delete', type: POST,
        },
    },
    message: {
        page: {
            url: '/api/message/page', type: GET,
        },
    },
};

export default ajaxRequestMap;