import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../../shared/utility";

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

  const matchesWithPets = matches.filter((user) => user.petData);

  const actionObj = action;
  delete actionObj.type;

  let newMatches = matchesWithPets;

  const findUsersLike = {
    location: { city: selectedLocation },
    petData: { petBreed: selectedBreed, petGender: selectedGender },
    userAge: "22",
  };

  let filterFunction = (
    filterValues,
    structureProps = Object.keys(filterValues),
    structureNumber
  ) => {
    // let filterMatches = matchesWithPets;
    console.log("[STRUCTURE]", structureProps);
    console.log(filterValues);

    structureNumber = 0;

    for (let props in filterValues) {
      if (typeof filterValues[props] === "string") {
        console.log(filterValues[props], props, structureNumber);
        if (structureNumber < 2) {
          console.log(filterValues[props]);
          // newMatches = newMatches.filter((match) => {
          //   return
          // })
        } else {
          newMatches = newMatches.filter((match) => {
            return match[props] === filterValues[props];
          });
        }
      } else {
        console.log(
          filterValues[props],
          Object.keys(filterValues[props]),
          structureNumber
        );

        filterFunction(
          filterValues[props],
          Object.keys(filterValues[props]),
          structureNumber++
        );
      }
    }
  };

  filterFunction(findUsersLike);
  console.log(newMatches);
  // for (let [key, value] of Object.entries(findUsersLike)) {
  //   for (const [filterKeys, filterValue] of Object.entries(value)) {
  //     if (Boolean(filterValue)) {
  //       newMatches = newMatches.filter((match) => {
  //         if (match[key][filterKeys] === filterValue) {
  //           return true;
  //         }
  //       });
  //     }
  //   }
  // }

  // let foundUsers = [];

  // for (let [key, values] of Object.entries(findUsersLike)) {
  //   console.log(findUsersLike[key]);
  //   let filteredUser = {};
  //   for (let match of newMatches) {
  //   }
  // }
  // const filters = [];

  // for (let prop in actionObj) {
  //   console.log(actionObj[prop]);
  //   if (Boolean(actionObj[prop])) {
  //     filters.push(actionObj[prop]);
  //   }
  // }

  // filters.forEach(filterValue => {
  //   newMatches = newMatches.filter(match => {
  //     for (let value of Object.values(match)) {
  //       if (Object.values(value).includes(filterValue)) {
  //         return true;
  //       }
  //     }
  //   });
  // });

  // console.log("[AFTER FILTER]", newMatches);

  // for (let propType in actionObj) {
  //   if (Boolean(actionObj[propType])) {
  //     testArr = testArr.filter((user) => {

  //     });
  //   }
  //   console.log(actionObj[propType]);
  // }

  // console.log(selectedLocation, selectedBreed, selectedGender);

  let selectedLocationValue = selectedLocation;
  let selectedBreedValue = selectedBreed;
  let selectedGenderValue = selectedGender;

  // if (!locationFilterValue && !selectedBreedValue && !selectedGenderValue) {
  //   locationFilterValue = location.city;
  //   selectedBreedValue = petData.petBreed;
  //   selectedGenderValue = petData.petGender;
  // }

  let filteredArray = matchesWithPets;

  if (Boolean(selectedLocation)) {
    filteredArray = matchesWithPets.filter(
      (user) => user.location.city === selectedLocationValue
    );

    if (Boolean(selectedBreed)) {
      filteredArray = filteredArray.filter(
        (user) => user.petData.petBreed === selectedBreedValue
      );
    }

    if (Boolean(selectedGender)) {
      filteredArray = filteredArray.filter(
        (user) => user.petData.petGender === selectedGenderValue
      );
    }
  } else if (Boolean(selectedBreed)) {
    filteredArray = matchesWithPets.filter(
      (user) => user.petData.petBreed === selectedBreedValue
    );

    if (Boolean(selectedGender)) {
      filteredArray = filteredArray.filter(
        (user) => user.petData.petGender === selectedGenderValue
      );
    }
  } else if (Boolean(selectedGender)) {
    filteredArray = matchesWithPets.filter(
      (user) => user.petData.petGender === selectedGenderValue
    );
  }

  console.log(filteredArray);

  const updatedMatchesDataFiltered = filteredArray.filter(
    (user) => !likedUsers.includes(user.userId)
  );

  return updateObject(state, {
    matchesDataFiltered: updatedMatchesDataFiltered,
    selectedLocation: selectedLocationValue,
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
