const updateUserInfo = (originalState, action) => {
    const newState = JSON.parse(JSON.stringify(originalState));

    newState.userInfo = action.payload.userInfo;

    return newState;
};

export default updateUserInfo;