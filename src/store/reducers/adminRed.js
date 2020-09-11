import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  allUsers: [{}],
  editedUser: {},
};

const setAllUsers = (state, action) => {
  const { allUsers } = action;

  return updateObject(state, {
    allUsers: allUsers,
  });
};

const setEditedUser = (state, action) => {
  const { editedUser } = action;

  return updateObject(state, {
    editedUser: editedUser,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USERS_ADMIN:
      return setAllUsers(state, action);
    case actionTypes.SET_EDITED_USER_ADMIN:
      return setEditedUser(state, action);
    default:
      return state;
  }
};

export default reducer;
