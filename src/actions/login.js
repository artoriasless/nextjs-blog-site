const login = userInfo => ({
    type: 'LOGIN',
    payload: {
        userInfo,
    },
});

export default login;