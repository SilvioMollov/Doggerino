import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

const initialState = {
  matches: [],
  selectedLocation: null,
  error: null,
  userData: {
    likedUsers: [],
  },
  likedBackUsersData: [],
  likedUsersData: [],
  matchesDataFiltered: [],
  locations: [],
  locationOptions: [],
  filter: {
    value: null,
    type: null,
  },
  loading: true,
};

const fetchMatches = (state, action) => {
  const { userId, matches } = action;

  let updatedMachesArray = null;

  updatedMachesArray = matches.filter((match) => match.userId !== userId);

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
    },
    likedBackUsersData: [],
    likedUsersData: [],
    matchesDataFiltered: [{}],
    locations: [],
    locationOptions: [],
    filter: {
      value: null,
      type: null,
    },
    loading: true,
  });
};

const userData = (state, action) => {
  const { userId, data } = action;

  let updatedUserData = null;


  updatedUserData = data.filter((match) => match.userId === userId);

  const [userData] = updatedUserData;

  console.log(userData.location.city)

  return updateObject(state, {
    userData: updateObject(state.userData, {
      ...userData,
    }),
    selectedLocation: userData.location.city,
  });
};

const matchesLocationsData = (state, action) => {
  const matchesArray = action.matchesData;
  const locationsData = [];
  const locationsSelectData = [];

  matchesArray.forEach((element) => {
    if (element.location !== "") {
      locationsData.push(element.location);
    }
  });


  const uniqueLocations = new Set(locationsData);

  uniqueLocations.forEach((el) => {
    locationsSelectData.push({ value: el, label: el });
  });

  return updateObject(state, {
    locations: locationsData,
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
    filterValue = location;
  }

  const filteredArray = matches.filter((el) => el.location === filterValue);

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
  //имаме всички потребители и техните харесани потребители
  const { likedUsersId } = action;
  const {
    userData: { userId, likedUsers },
  } = state;

  let allUserLikes = {};

  for (let userId in likedUsersId) {
    // console.log(Object.values(likedUsersId[userId]).map(el => el.likedUserId))
    allUserLikes[userId] = Object.values(likedUsersId[userId]).map(
      (el) => el.likedUserId
    );
  }

  const likedBackMatches = likedUsers.filter(
    (matchId) => allUserLikes[matchId] && allUserLikes[matchId].includes(userId)
  );

  // is all the userIds and their data properties
  // const likedBackUsersData = matches.filter((match) =>
  //   likedBackMatches.includes(match.userId)
  // );

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
