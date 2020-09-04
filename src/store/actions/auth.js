import * as actionTypes from "./actionTypes";
import axios from "axios";
import { fetchMatches, fetchLikedUsers } from "./maches";

export const signUp = (
  email,
  password,
  location,
  firstName,
  lastName,
  isSignUp,
  userId
) => {
  return (dispatch) => {
    dispatch(authStart());
    const signUpData = {
      email: email,
      password: password,
      returnSecureToken: true,
    };

    let signUpUrl =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA2eFNubGHzueGztDIe3_s-TGjdYgsLCN4";
    axios
      .post(signUpUrl, signUpData)
      .then((response) => {
        dispatch(
          dataPost(
            email,
            location,
            firstName,
            lastName,
            isSignUp,
            response.data.localId
          )
        );
      })
      .catch((err) => {
        console.log("[SignUp]",err.errors.message);
        dispatch(authFail(err));
      });
  };
};

export const signIn = (email, password) => {
  return (dispatch) => {
    dispatch(authStart());
    const signInData = {
      email: email,
      password: password,
      returnSecureToken: true,
    };

    let signInUrl =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA2eFNubGHzueGztDIe3_s-TGjdYgsLCN4";

    axios
      .post(signInUrl, signInData)
      .then((response) => {
        console.log("[SignIn]",response);
        const expirationDate = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );
        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("expirationDate", expirationDate);
        localStorage.setItem("userId", response.data.localId);
        dispatch(authSuccess(response.data.idToken, response.data.localId, '/match'));
        dispatch(fetchMatches(response.data.localId))
        // dispatch(authRedirectPath('/match'))
        dispatch(checkAuthTimeout(response.data.expiresIn));
        dispatch(fetchLikedUsers(response.data.localId, response.data.idToken))
      })
      .catch((error) => {
        console.log("[SignIn]",error);
      });
  };
};

export const dataPost = (
  email,
  location,
  firstName,
  lastName,
  isSignUp,
  userId
) => {
  return (dispatch) => {
    const userData = {
      email: email,
      location: location,
      firstName: firstName,
      lastName: lastName,
      userId: userId,
    };

    if (isSignUp) {
      axios
        .post("https://doggerino-79ffd.firebaseio.com/users.json", userData)
        .then((response) => {
          console.log(response);
          dispatch(authIsSignUp())
        })
        .catch((error) => console.log(error));
    }
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout("/auth"));
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout('/auth'));
      } else {
        const userId = localStorage.getItem("userId");
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )


        );
      }
    }
  };
};

export const authRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authIsSignUp = () => {
  return {
    type: actionTypes.AUTH_IS_SING_UP,
  };
};

export const authSuccess = (token, userId, path) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: token,
    userId: userId,
    path: path
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout('/auth'));
    }, expirationTime * 1000);
  };
};

export const logout = (path) => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("userId");
  return {
    type: actionTypes.AUTH_LOGOUT,
    path: path
  };
};
