const getUserDefault = (originalState, action) => {
    const newState = JSON.parse(JSON.stringify(originalState));

    newState.userInfo = action.payload.userInfo;
    newState.hasReqDefault = true;

    if (newState.userInfo.id && newState.userInfo.email && newState.userInfo.password) {
        newState.isLogin = true;
    } else {
        newState.isLogin = false;
    }

    return newState;
};

export default getUserDefault;