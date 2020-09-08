import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const inittialState = {
  messagedUser: {},
  userChatData: [{}],
  messagedUserChatData: [{}],
  loading: true,
  chatData: [{}],
};

const messagedUser = (state, action) => {
  const { messagedUserId, allUsers } = action;

  const [messagedUser] = allUsers.filter(
    (user) => user.userId === messagedUserId
  );

  return updateObject(state, {
    messagedUser: messagedUser,
  });
};

const clearState = (state, action) => {
  return updateObject(state, {
    messagedUser: {},
    userChatData: [{}],
    messagedUserChatData: [{}],
    loading: true,
    chatData: [{}],
  });
};

const setUserChatData = (state, action) => {
  const { userId, chatUserData } = action;
  const updatedUserChat = { [userId]: chatUserData };
  return updateObject(state, {
    userChatData: updatedUserChat,
  });
};

const setMessagedUserChatData = (state, action) => {
  const { messagedUserId, chatData } = action;
  const updatedMessagedUserChat = { [messagedUserId]: chatData };

  return updateObject(state, {
    messagedUserChatData: updatedMessagedUserChat,
  });
};

const formatChatData = (state, action) => {
  const { messagedUserChatData, userChatData } = state;

  let updatedRecieverData = [];
  let updatedSenderData = [];

  for (let user in messagedUserChatData) {
    updatedRecieverData = messagedUserChatData[user].map((mess) => {
      return {
        ...mess,
        isSender: false,
        senderId: user,
        formatedDate: new Date(mess.currentDate).toLocaleString(),
      };
    });
  }

  for (let user in userChatData) {
    updatedSenderData = userChatData[user].map((mess) => {
      return {
        ...mess,
        isSender: true,
        senderId: user,
        formatedDate: new Date(mess.currentDate).toLocaleString(),
      };
    });
  }

  const chatData = updatedSenderData
    .concat(updatedRecieverData)
    .sort((a, b) => a.currentDate - b.currentDate);

  return updateObject(state, {
    chatData: chatData,
    loading: false,
  });
};

const reducer = (state = inittialState, action) => {
  switch (action.type) {
    case actionTypes.MESSAGED_USER:
      return messagedUser(state, action);
    case actionTypes.CLEAR_CHAT_STATE:
      return clearState(state, action);
    case actionTypes.SET_USER_CHAT_DATA:
      return setUserChatData(state, action);
    case actionTypes.SET_MESSAGED_USER_CHAT_DATA:
      return setMessagedUserChatData(state, action);
    case actionTypes.FORTMAT_CHAT_DATA:
      return formatChatData(state, action);
    default:
      return state;
  }
};

export default reducer;
