const getUserDefault = userInfo => ({
    type: 'GET_USER_DEFAULT',
    payload: {
        userInfo,
    },
});

export default getUserDefault;