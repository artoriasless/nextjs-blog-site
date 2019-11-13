const toggleHidden = key => ({
    type: 'TOGGLE_HIDDEN',
    payload: {
        key,
    },
});

export default toggleHidden;