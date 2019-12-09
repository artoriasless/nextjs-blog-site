import { actionTypes } from 'actions';

import getUserDefault from './get-user-default';
import loginFunc from './login';
import logoutFunc from './logout';
import registerFunc from './register';
import updateUserInfoFunc from './update-user-info';
import updatePwdFunc from './update-pwd';
import toggleShow from './toggle-show';
import increaseCount from './increase-count';

const defaultState = {
    isLogin: false,
    hasReqDefault: false,
    userInfo: {},

    _show: {
        loginModal: false,
    },

    _count: {
        avatar: 0,
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
    
    case actionTypes.TOGGLE_SHOW:
        return toggleShow(state, action);
    
    case actionTypes.INCREASE_COUNT:
        return increaseCount(state, action);

    default:
        return state;
    }
};

export default reducers;