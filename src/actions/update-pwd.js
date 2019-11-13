const updatePwd = userInfo => ({
    type: 'UPDATE_PWD',
    payload: {
        userInfo,
    },
});

export default updatePwd;