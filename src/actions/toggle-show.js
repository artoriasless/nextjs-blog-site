const toggleShow = key => ({
    type: 'TOGGLE_SHOW',
    payload: {
        key,
    },
});

export default toggleShow;