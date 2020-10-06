import * as actionTypes from "../actions/actionTypes";
import { updateObject, filterFunction } from "../../shared/utility";

const initialState = {
  matches: [],
  selectedLocation: null,
  selectedBreed: null,
  selectedGenderIsMale: null,
  error: null,
  userData: {
    likedUsers: [],
    petData: {},
  },
  likedBackUsersData: [],
  likedUsersData: [],
  matchesDataFiltered: [],
  locationOptions: [],
  breedOptions: [],
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
    matches: [],
    selectedLocation: null,
    selectedBreed: null,
    selectedGenderIsMale: null,
    error: null,
    userData: {
      likedUsers: [],
      petData: {},
    },
    likedBackUsersData: [],
    likedUsersData: [],
    matchesDataFiltered: [],
    locationOptions: [],
    breedOptions: [],
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
    selectedBreed: null,
    // selectedGenderIsMale: userData.petData.petGender === "Male" ? true : false,
  });
};

const matchesLocationsData = (state, action) => {
  const { userData, matches } = state;

  let uniqueLocations = new Set();
  let uniqueBreeds = new Set();
  let locationsSelectData = [];
  let breedsSelectData = [];

  matches.forEach((user) => {
    if (Object.values(user.location).length) {
      if (user.location.country === userData.location.country) {
        uniqueLocations.add(user.location.city);
        if (Boolean(user.petData)) {
          uniqueBreeds.add(user.petData.petBreed);
        }
      }
    }
  });

  uniqueBreeds.forEach((breed) => {
    breedsSelectData.push({ value: breed, label: breed });
  });

  uniqueLocations.forEach((city) => {
    locationsSelectData.push({ value: city, label: city });
  });

  return updateObject(state, {
    locationOptions: locationsSelectData,
    breedOptions: breedsSelectData,
  });
};

const matchesFilter = (state, action) => {
  const { selectedLocation, selectedBreed, selectedGender } = action;
  const {
    matches,
    userData: { likedUsers },
  } = state;

  let matchesWithPets = matches.filter((user) => user.petData);

  const findUsersLike = {
    location: { city: selectedLocation },
    petData: { petBreed: selectedBreed, petGender: selectedGender },
  };

  let filterMatches = (matches, filterObj) => {
    return matches.filter((match) => filterFunction(match, filterObj));
  };

  matchesWithPets = filterMatches(matchesWithPets, findUsersLike);

  const updatedMatchesDataFiltered = matchesWithPets.filter(
    (user) => !likedUsers.includes(user.userId)
  );

  return updateObject(state, {
    matchesDataFiltered: updatedMatchesDataFiltered,
    selectedLocation: selectedLocation,
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
  let { likedUsers } = action;
  const { matchesDataFiltered } = state;

  if (!Boolean(likedUsers)) {
    likedUsers = {};
  }

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
    matches,
  } = state;

  let allUserLikes = {};
  let updatedLikedUsersData = [];

  for (let userId in likedUsersId) {
    allUserLikes[userId] = Object.values(likedUsersId[userId]).map(
      (el) => el.likedUserId
    );
  }

  const likedBackMatches = likedUsers.filter(
    (matchId) => allUserLikes[matchId] && allUserLikes[matchId].includes(userId)
  );

  if (Boolean(allUserLikes[userId])) {
    const likedUsersData = matches.filter((match) =>
      allUserLikes[userId].includes(match.userId)
    );

    updatedLikedUsersData = likedUsersData.map((match) => {
      return {
        ...match,
        matched: likedBackMatches.includes(match.userId),
      };
    });
  }

  return updateObject(state, {
    likedBackUsersData: likedBackMatches,
    likedUsersData: updatedLikedUsersData,
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
    default:
      return state;
  }
};

export default reducer;
