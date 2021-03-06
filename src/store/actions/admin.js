import * as actionTypes from "./actionTypes";
import axios from "axios";
import { fetchMatches } from "./maches";

export const setAllUsers = (allUsers) => {
  return {
    type: actionTypes.SET_USERS_ADMIN,
    allUsers,
  };
};

export const setEditedUser = (editedUser) => {
  return {
    type: actionTypes.SET_EDITED_USER_ADMIN,
    editedUser,
  };
};

export const updateEditedUser = (
  firebaseUserId,
  editedUserData,
  token,
  isPetData
) => {
  return (dispatch) => {
    if (isPetData) {
      axios
        .patch(
          `https://doggerino-79ffd.firebaseio.com/users/${firebaseUserId}/petData.json/?auth=${token}`,
          editedUserData
        )
        .then((response) => {
          console.log("[updateEditedUserPet]", response);
          dispatch(fetchMatches(localStorage.getItem("userId"), token));
        })
        .catch((error) => {
          console.log("[updateEditedUserPet]", error);
        });
    } else {
      axios
        .patch(
          `https://doggerino-79ffd.firebaseio.com/users/${firebaseUserId}.json/?auth=${token}`,
          editedUserData
        )
        .then((response) => {
          console.log("[updateEditedUser]", response);
          dispatch(fetchMatches(localStorage.getItem("userId"), token));
        })
        .catch((error) => {
          console.log("[updateEditedUser]", error);
        });
    }
  };
};

export const deleteUserFromDb = (firebaseUserId, token) => {
  return (dispatch) => {
    const userId = firebaseUserId[1].userId;
    axios
      .delete(
        `https://doggerino-79ffd.firebaseio.com/users/${firebaseUserId[0]}.json/?auth=${token}`
      )
      .then((response) => {
        axios
          .delete(
            `https://doggerino-79ffd.firebaseio.com/chatData/${userId}.json/?auth=${token}`
          )
          .then((response) => {
            axios
              .delete(
                `https://doggerino-79ffd.firebaseio.com/userData/${userId}.json/?auth=${token}`
              )
              .then((response) => {
                console.log("[DeletesUserData]", response);
                dispatch(fetchMatches(localStorage.getItem("userId"), token));
              })
              .catch((error) => {
                console.log("[DeletesUserData]", error);
              });
            console.log("[DeletesChatData]", response);
          })
          .catch((error) => {
            console.log("[DeleteChatData]", error);
          });

        console.log("[DeleteUserFromDb]", response);
      })
      .catch((error) => {
        console.log("[DeleteUserFromDb]", error);
      });
  };
};
