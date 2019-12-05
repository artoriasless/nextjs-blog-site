import { actionTypes } from 'actions';

import getUserDefault from './get-user-default';
import loginFunc from './login';
import logoutFunc from './logout';
import registerFunc from './register';
import updateUserInfoFunc from './update-user-info';
import updatePwdFunc from './update-pwd';
import toggleHidden from './toggle-hidden';

const defaultState = {
    isLogin: false,
    userInfo: {},

    _hidden: {
        loginModal: true,
        replyModal: true,
    },
};
const reducers = (state = defaultState, action = {}) => {
    switch (action.type) {

    case actionTypes.GET_USER_DEFAULT:
        return getUserDefault(state, action);

    case actionTypes.LOGIN:
        return loginFunc(state, action);

    case actionTypes.LOGOUT:
        return logoutFunc(state, action);

    case actionTypes.REGISTER:
        return registerFunc(state, action);

    case actionTypes.UPDATE_USER_INFO:
        return updateUserInfoFunc(state, action);

    case actionTypes.UPDATE_PWD:
        return updatePwdFunc(state, action);
    
    case actionTypes.TOGGLE_HIDDEN:
        return toggleHidden(state, action);

    default:
        return state;
    }
};

export default reducers;