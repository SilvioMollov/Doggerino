import * as actionTypes from "./actionTypes";
import axios from "axios";
import { setAllUsers } from "./admin";

export const fetchMatchesSuccess = (matches, userId) => {
  return {
    type: actionTypes.FETCH_MATCHES,
    matches: matches,
    userId: userId,
  };
};

export const fetchMatchesFail = (error) => {
  return {
    type: actionTypes.FETCH_MATCHES_FAIL,
    error: error,
  };
};

export const clearStateMatches = () => {
  return {
    type: actionTypes.CLEAR_STATE_MATCHES,
  };
};

export const userData = (data, userId) => {
  return {
    type: actionTypes.SET_USER_DATA,
    data: data,
    userId: userId,
  };
};

export const matchesLocationsData = (matches) => {
  return {
    type: actionTypes.MATCHES_LOCATIONS_DATA,
    matchesData: matches,
  };
};

export const matchesFilter = (selectedLocation) => {
  return {
    type: actionTypes.MATCHES_FILTER_SELECT,
    selectedLocation,
  };
};

export const fetchMatches = (userId, token) => {
  return (dispatch) => {
    axios
      .get(`https://doggerino-79ffd.firebaseio.com/users.json/?auth=${token}`)
      .then((response) => {
        const fetchData = [];

        for (let match in response.data) {
          // console.log({...response.data[match]})
          fetchData.push({ ...response.data[match] });
        }
        console.log("[FetchMatches]", response);
        dispatch(userData(fetchData, userId));
        dispatch(fetchMatchesSuccess(fetchData, userId));
        dispatch(setAllUsers(response.data))
        dispatch(matchesLocationsData(fetchData));
        dispatch(matchesFilter());
      })
      .catch((error) => {
        console.log("[FetchMatches]", error);
      });
  };
};

export const updatedLikedUsers = (likedUsers) => {
  return {
    type: actionTypes.UPDATE_LIKED_USERS,
    likedUsers,
  };
};

export const removeLikedUser = (likedUserId) => {
  return {
    type: actionTypes.REMOVE_LIKED_USER,
    likedUserId: likedUserId,
  };
};

export const fetchLikedUsers = (userId, token) => {
  return (dispatch) => {
    axios
      .get(
        `https://doggerino-79ffd.firebaseio.com/userData/${userId}.json/?auth=` +
          token
      )
      .then((response) => {
        console.log("[FetchLikedUsers]", response);
        dispatch(updatedLikedUsers(response.data));
        dispatch(fetchAllLikedUsers(token));
      })
      .catch((error) => {
        console.log("[FetchLikedUsers]", error);
      });
  };
};

export const addingLikedUsers = (likedUserId) => {
  return {
    type: actionTypes.ADD_LIKED_USER,
    likedUserId,
  };
};

export const postLikedUsers = (token, userId, likedUserId) => {
  const userData = { likedUserId };

  return (dispatch) => {
    axios
      .post(
        `https://doggerino-79ffd.firebaseio.com/userData/${userId}.json/?auth=${token}`,
        userData
      )
      .then((response) => {
        console.log("[PostLikedUsers]", response);
        dispatch(removeLikedUser(likedUserId));
        dispatch(addingLikedUsers(likedUserId));
      })
      .catch((error) => {
        console.log("[PostLikedUsers]", error);
      });
  };
};

export const fetchAllLikedUsers = (token) => {
  return (dispatch) => {
    axios
      .get(
        `https://doggerino-79ffd.firebaseio.com/userData.json/?auth=${token}`
      )
      .then((response) => {
        console.log("[FetchAllLikedUsers]", response);
        // figure out where to dispatch this
        dispatch(setLikedBackUsers(response.data));
        dispatch(setLikedUsersData());
      })
      .catch((error) => {
        console.log("[FetchAllLikedUsers]", error);
      });
  };
};

export const setLikedUsersData = () => {
  return {
    type: actionTypes.SET_LIKED_USERS_DATA,
  };
};

export const setLikedBackUsers = (likedUsersId) => {
  return {
    type: actionTypes.SET_MATCHED_USERS_DATA,
    likedUsersId,
  };
};
