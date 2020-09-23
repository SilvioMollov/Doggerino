import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  matches: [],
  selectedLocation: null,
  error: null,
  userData: {
    likedUsers: [],
    petData: {},
  },
  
  likedBackUsersData: [],
  likedUsersData: [],
  matchesDataFiltered: [],
  locationOptions: [],
  loading: true,
};

const fetchMatches = (state, action) => {
  const { userId, matches } = action;

  let updatedMachesArray = matches.filter(
    (match) => !Boolean(match.isAdmin) && match.userId !== userId
  );

  return updateObject(state, {
    matches: updatedMachesArray,
  });
};

const fetchMatchesFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
  });
};

const clearStateMatches = (state, action) => {
  return updateObject(state, {
    matches: [{}],
    selectedLocation: null,
    error: null,
    userData: {
      likedUsers: [],
      petData: {}
    },
    likedBackUsersData: [],
    likedUsersData: [],
    matchesDataFiltered: [],
    locationOptions: [],
    loading: true,
  });
};

const userData = (state, action) => {
  const { userId, data } = action;

  let updatedUserData = null;

  updatedUserData = data.filter((match) => match.userId === userId);

  const [userData] = updatedUserData;

  return updateObject(state, {
    userData: updateObject(state.userData, {
      ...userData,
    }),
    selectedLocation: userData.location.city,
  });
};

const matchesLocationsData = (state, action) => {
  const { userData, matches } = state;

  let uniqueLocations = new Set();
  let locationsSelectData = [];

  matches.forEach((user) => {
    if (Object.values(user.location).length) {
      if (user.location.country === userData.location.country) {
        uniqueLocations.add(user.location.city);
      }
    }
  });

  uniqueLocations.forEach((city) => {
    locationsSelectData.push({ value: city, label: city });
  });

  return updateObject(state, {
    locations: [],
    locationOptions: locationsSelectData,
  });
};

const matchesFilter = (state, action) => {
  const { selectedLocation } = action;
  const {
    matches,
    userData: { location, likedUsers },
  } = state;

  let filterValue = selectedLocation;

  if (!filterValue) {
    filterValue = location.city;
  }

  const filteredArray = matches.filter(
    (el) => el.location.city === filterValue
  );

  const updatedMatchesDataFiltered = filteredArray.filter(
    (user) => !likedUsers.includes(user.userId)
  );

  return updateObject(state, {
    matchesDataFiltered: updatedMatchesDataFiltered,
    selectedLocation: filterValue,
    loading: false,
  });
};

const removeLikedUser = (state, action) => {
  const { likedUserId } = action;
  const { matchesDataFiltered } = state;

  const updatedMatchesData = matchesDataFiltered.filter(
    (match) => match.userId !== likedUserId
  );

  return updateObject(state, {
    matchesDataFiltered: updatedMatchesData,
  });
};

const updateLikedUsers = (state, action) => {
  const { likedUsers } = action;
  const { matchesDataFiltered } = state;

  const likedUsersArray = Object.values(likedUsers);
  let likedUsersUpdated = [];
  const uniqueLikedUsersArray = [];
  likedUsersArray.forEach((el) => {
    likedUsersUpdated.push(...Object.values(el));
  });

  new Set(likedUsersUpdated).forEach((el) => uniqueLikedUsersArray.push(el));

  const updatedMatchesDataFiltered = matchesDataFiltered.filter(
    (user) => !uniqueLikedUsersArray.includes(user.userId)
  );

  return updateObject(state, {
    matchesDataFiltered: updatedMatchesDataFiltered,
    loading: false,
    userData: updateObject(state.userData, {
      likedUsers: uniqueLikedUsersArray,
    }),
  });
};

const addLikedUser = (state, action) => {
  const { likedUserId } = action;
  const {
    userData: { likedUsers },
  } = state;

  const updatedLikedUsers = likedUsers;

  updatedLikedUsers.push(likedUserId);

  return updateObject(state, {
    userData: updateObject(state.userData, {
      likedUsers: updatedLikedUsers,
    }),
  });
};

const setLikedBackUsers = (state, action) => {
  const { likedUsersId } = action;
  const {
    userData: { userId, likedUsers },
  } = state;

  let allUserLikes = {};

  for (let userId in likedUsersId) {
    allUserLikes[userId] = Object.values(likedUsersId[userId]).map(
      (el) => el.likedUserId
    );
  }

  const likedBackMatches = likedUsers.filter(
    (matchId) => allUserLikes[matchId] && allUserLikes[matchId].includes(userId)
  );

  return updateObject(state, {
    likedBackUsersData: likedBackMatches,
  });
};

const setLikedUsersData = (state, action) => {
  const {
    likedBackUsersData,
    matches,
    userData: { likedUsers },
  } = state;

  const likedUsersData = matches.filter((match) =>
    likedUsers.includes(match.userId)
  );

  const likedUsersDataUpdated = likedUsersData.map((likedUser) => {
    return {
      ...likedUser,
      matched: likedBackUsersData.includes(likedUser.userId),
    };
  });

  return updateObject(state, {
    likedUsersData: likedUsersDataUpdated,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_MATCHES:
      return fetchMatches(state, action);
    case actionTypes.FETCH_MATCHES_FAIL:
      return fetchMatchesFail(state, action);
    case actionTypes.CLEAR_STATE_MATCHES:
      return clearStateMatches(state, action);
    case actionTypes.SET_USER_DATA:
      return userData(state, action);
    case actionTypes.MATCHES_LOCATIONS_DATA:
      return matchesLocationsData(state, action);
    case actionTypes.MATCHES_FILTER_SELECT:
      return matchesFilter(state, action);
    case actionTypes.REMOVE_LIKED_USER:
      return removeLikedUser(state, action);
    case actionTypes.UPDATE_LIKED_USERS:
      return updateLikedUsers(state, action);
    case actionTypes.ADD_LIKED_USER:
      return addLikedUser(state, action);
    case actionTypes.SET_MATCHED_USERS_DATA:
      return setLikedBackUsers(state, action);
    case actionTypes.SET_LIKED_USERS_DATA:
      return setLikedUsersData(state, action);
    default:
      return state;
  }
};

export default reducer;
