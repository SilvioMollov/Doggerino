import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: null,
  authRedirectPath: "/",
  isSignUp: false,
};

const authStart = (state, action) => {
  return updateObject(state, { 
    error: null,
    loading: true 
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    token: action.idToken,
    userId: action.userId,
    loading: false,
    error: null,
    authRedirectPath: action.path
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    token: null,
    userId: null,
    authRedirectPath: action.path
  });
};

const setAuthRedirectPath = (state, action) => {
  return updateObject(state, {
    authRedirectPath: action.path,
  });
};

const authIsSignUpHandler = (state, action) => {
    return updateObject(state, {
        isSignUp: !state.isSignUp
    })
}



const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return setAuthRedirectPath(state, action);
    case actionTypes.AUTH_IS_SING_UP:
        return authIsSignUpHandler(state, action)
    default:
        
      return state;
  }
};

export default reducer;
