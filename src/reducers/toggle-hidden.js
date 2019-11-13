const toggleHidden = (originalState, action) => {
    const newState = JSON.parse(JSON.stringify(originalState));
    const key = action.payload.key;

    newState._hidden[key] = !originalState._hidden[key];

    return newState;
};

export default toggleHidden;