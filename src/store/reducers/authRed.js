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
    loading: true,
  });
};

const authSuccess = (state, action) => {
  const { idToken, userId, path } = action;

  return updateObject(state, {
    token: idToken,
    userId: userId,
    loading: false,
    error: null,
    authRedirectPath: path,
  });
};

const authFail = (state, action) => {
  const { error } = action;

  return updateObject(state, {
    error: error,
  });
};

const authLogout = (state, action) => {
  const { path } = action;

  return updateObject(state, {
    token: null,
    userId: null,
    authRedirectPath: path,
  });
};

const setAuthRedirectPath = (state, action) => {
  const { path } = action;

  return updateObject(state, {
    authRedirectPath: path,
  });
};

const authIsSignUpHandler = (state, action) => {
  const { isSignUp } = state;

  return updateObject(state, {
    isSignUp: !isSignUp,
  });
};

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
      return authIsSignUpHandler(state, action);
    default:
      return state;
  }
};

export default reducer;
