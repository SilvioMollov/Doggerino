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
