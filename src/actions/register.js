const register = userInfo => ({
    type: 'REGISTER',
    payload: {
        userInfo,
    },
});

export default register;
