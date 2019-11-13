const updateUserInfo = userInfo => ({
    type: 'UPDATE_USER_INFO',
    payload: {
        userInfo,
    },
});

export default updateUserInfo;