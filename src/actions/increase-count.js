const increaseCount = key => ({
    type: 'INCREASE_COUNT',
    payload: {
        key,
    },
});

export default increaseCount;