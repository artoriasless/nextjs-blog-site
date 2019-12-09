const toggleShow = (originalState, action) => {
    const newState = JSON.parse(JSON.stringify(originalState));
    const key = action.payload.key;

    newState._show[key] = !originalState._show[key];

    return newState;
};

export default toggleShow;