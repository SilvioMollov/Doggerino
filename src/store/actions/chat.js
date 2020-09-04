import * as actionTypes from "./actionTypes";
import axios from "axios";

export const postChatMessage = (token, userId, messagedUserId, message) => {
  let currentDate = new Date().getTime();

  const Updatedessage = { message, currentDate };

  return (dispatch) => {
    axios
      .post(
        `https://doggerino-79ffd.firebaseio.com/chatData/${userId}/${messagedUserId}.json/?auth=${token}`,
        Updatedessage
      )
      .then((response) => {
        dispatch(fetchChatData(token, userId, messagedUserId))
        console.log("[PostChatMessage]", response);
      })
      .catch((err) => {
        console.log("[PostChatMessage]", err);
      });
  };
};

export const fetchChatData = (token, userId, messagedUserId) => {
  return (dispatch) => {
    axios
      .get(
        `https://doggerino-79ffd.firebaseio.com/chatData/${userId}/${messagedUserId}.json/?auth=${token}`
      )
      .then((response) => {
        let chatUserData = [];

        for (let user in response.data) {
          chatUserData.push(response.data[user]);
        }

        axios
          .get(
            `https://doggerino-79ffd.firebaseio.com/chatData/${messagedUserId}/${userId}.json/?auth=${token}`
          )
          .then((response) => {
            let chatMessagedUserData = [];

            for (let messagedUser in response.data) {
              chatMessagedUserData.push(response.data[messagedUser]);
            }

            dispatch(
              setMessagedUserChatData(messagedUserId, chatMessagedUserData)
            );
            dispatch(formatChatData())

            console.log("[FetchingMessagedUserData]", response);
          })
          .catch((error) => {
            console.log("[FetchingMessagedUserData]", error);
          });

        dispatch(setUserChatData(userId, chatUserData));
        console.log("[FetchChatData]", response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
};

export const setUserChatData = (userId, chatUserData) => {
  return {
    type: actionTypes.SET_USER_CHAT_DATA,
    userId: userId,
    chatUserData: chatUserData,
  };
};

export const setMessagedUserChatData = (messagedUserId, chatData) => {
  return {
    type: actionTypes.SET_MESSAGED_USER_CHAT_DATA,
    messagedUserId: messagedUserId,
    chatData: chatData,
  };
};

export const messagedUser = (userData) => {
  return {
    type: actionTypes.MESSAGED_USER,
    messagedUserData: userData,
  };
};

export const clearChatState = () => {
  return {
    type: actionTypes.CLEAR_CHAT_STATE,
  };
};

export const formatChatData = () => {
  return {
    type: actionTypes.FORTMAT_CHAT_DATA,
  };
};
