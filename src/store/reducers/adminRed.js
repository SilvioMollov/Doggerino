import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  allUsers: [{}],
};

const setAllUsers = (state, action) => {
  const { allUsers } = action;

  return updateObject(state, {
    allUsers: allUsers,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USERS_ADMIN:
      return setAllUsers(state, action);
    default:
      return state;
  }
};

export default reducer;
