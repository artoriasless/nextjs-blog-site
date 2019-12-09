const increaseCount = (originalState, action) => {
    const newState = JSON.parse(JSON.stringify(originalState));
    const key = action.payload.key;

    newState._count[key] = (newState._count[key] || 0) + 1;

    return newState;
};

export default increaseCount;