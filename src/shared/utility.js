export const updateObject = (oldObject, updateProps) => {
  return {
    ...oldObject,
    ...updateProps,
  };
};

export const processValidity = (value, inputType) => {
  const {
    required,
    mailFormat,
    minLength,
    minAge,
    maxAge,
    maxLength,
  } = inputType.validation;

  const format = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  let isValid = true;

  if (required) {
    isValid = value.trim() !== "" && isValid;
  }

  if (mailFormat) {
    isValid = Boolean(value.match(format)) && isValid;
  }

  if (minLength) {
    isValid = value.length >= minLength && isValid;
  }

  if (maxLength) {
    isValid = value.length <= maxLength && isValid;
  }

  if (minAge) {
    isValid = value >= minAge && isValid;
  }

  if (maxAge) {
    isValid = value <= maxAge && isValid;
  }

  return isValid;
};

// filter Algorithm, accepts the to be (filteredObj, filter, include ),  
//the filter argument has to mimic the filtered Obj with its props.
//the include argument is set by default to true, it marks if elements should be includede by the filter settings or included.
// Like this:
//===============================================================
// const findUsersLike = {
//   location: { city: selectedLocation },
//   petData: { petBreed: selectedBreed, petGender: selectedGender },
// };

export const filterFunction = (filteredObj, filter, include = true) => {
  let isAMatch = false;
  let isAMatchArr = [];

  let recursion = (filteredObj, filter) => {
    for (let prop in filter) {
      if (typeof filter[prop] !== "object") {
        if (filter[prop]) {
          if (include) {
            isAMatch = filteredObj[prop] === filter[prop];
            isAMatchArr.push(isAMatch);
          } else {
            isAMatch = filteredObj[prop] !== filter[prop];
            isAMatchArr.push(isAMatch);
          }
        }
      } else {
        recursion(filteredObj[prop], filter[prop]);
      }
    }
  };

  recursion(filteredObj, filter);

  return isAMatchArr.every((val) => val === true);
};
