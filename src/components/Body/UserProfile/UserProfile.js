import React, { Component } from 'react';
import { connect } from 'react-redux';
import DogBreeds from 'dog-breeds';

import * as actions from '../../../store/actions/index';
import './UserProfile.css';
import CountryLists from 'all-countries-and-cities-json';
import Spinner from '../../UI/Spinner/Spinner';
import CardHolder from '../Match/CardHolder/CardHolder';
import Select from 'react-select';

export class UserProfile extends Component {
  state = {
    citiesSelectOptions: [{}],
    moreSettings: false,
    petSettings: false,
    editedPetState: {
      petName: {
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      petAge: {
        value: '',
        validation: {
          required: true,
          maxAge: 12,
          maxLength: 2,
        },
        valid: false,
        touched: false,
      },
      petBreed: {
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      petGender: {
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      petWeight: {
        value: '',
        validation: {
          required: true,
          maxLength: 2,
        },
        valid: false,
        touched: false,
      },
      petDescription: {
        value: '',
        validation: {
          required: false,
          maxLength: 300,
        },
        valid: false,
        touched: false,
      },
    },
    editedUserState: {
      firstName: {
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      lastName: {
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      userAge: {
        value: '',
        validation: {
          required: true,
          maxLength: 2,
          minAge: 18,
          maxAge: 99,
        },
        valid: false,
        touched: false,
      },
      country: {
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      city: {
        value: '',
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      description: {
        value: '',
        validation: {
          required: false,
          maxLength: 300,
        },
        valid: false,
        touched: false,
      },
    },
  };

  processValidity = (value, inputType) => {
    const { password } = this.state.editedUserState;
    const {
      required,
      mailFormat,
      minLength,
      matching,
      minAge,
      maxAge,
      maxLength,
    } = inputType.validation;

    const format = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    let isValid = true;

    if (required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (mailFormat) {
      isValid = Boolean(value.match(format)) && isValid;
    }

    if (minLength) {
      isValid = value.length >= minLength && isValid;
    }

    if (matching) {
      isValid = value === password.value && isValid;
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

  onChangeHandler = (event, inputType, stateType) => {
    const { editedUserState, editedPetState } = this.state;

    switch (stateType) {
      case 'editedUserState':
        console.log(' im in UserState');
        break;
      case 'editedPetState':
        console.log(' im in UserState');
        break;
      default:
        console.log('ERROR');
    }

    console.log(inputType);

    let updatedUser = {};

    if (inputType.name === 'country' || inputType.name === 'city') {
      let citiesSelect = [];

      if (inputType.name === 'country') {
        CountryLists[event.value].forEach((city) =>
          citiesSelect.push({ value: city, label: city })
        );
        this.setState({ citiesSelectOptions: citiesSelect });
      }

      updatedUser = {
        ...editedUserState,
        [inputType.name]: {
          ...editedUserState[inputType.name],
          value: event.value,
          valid: this.processValidity(
            event.value,
            editedUserState[inputType.name]
          ),
          touched: true,
        },
      };
    } else {
      updatedUser = {
        ...editedUserState,
        [inputType]: {
          ...editedUserState[inputType],
          value: event.target.value,
          valid: this.processValidity(
            event.target.value,
            editedUserState[inputType]
          ),
          touched: true,
        },
      };
    }

    console.log(updatedUser);

    this.setState({ editedUserState: updatedUser });
  };

  moreSettingsButtonClickHandler = () => {
    const { editedUserState } = this.state;

    this.setState({ moreSettings: !this.state.moreSettings });

    for (const propType in editedUserState) {
      if (editedUserState[propType].touched) {
        if (editedUserState.country.touched) {
          this.setState((state) => {
            state.citiesSelectOptions = [{}];
          });
        }

        this.setState((state) => {
          return (
            (editedUserState[propType].value = ''),
            (editedUserState[propType].valid = false),
            (editedUserState[propType].touched = false)
          );
        });
      }
    }
  };

  isInvalid = (touched, valid, value) => {
    return touched && !valid && value;
  };

  submitHandler = (e) => {
    e.preventDefault();

    const { editedUserState } = this.state;
    const { onUpdateEditedUser, userData } = this.props;

    let editedUserData = {};

    for (let propType in editedUserState) {
      if (
        editedUserState[propType].valid &&
        editedUserState[propType].touched
      ) {
        editedUserData = {
          ...editedUserData,
          location: {
            country: Boolean(editedUserState['country'].value)
              ? editedUserState['country'].value
              : userData.location.country,
            city: Boolean(editedUserState['city'].value)
              ? editedUserState['city'].value
              : userData.location.city,
          },
          [propType]: editedUserState[propType].value,
        };
      }
    }

    delete editedUserData.country;
    delete editedUserData.city;

    this.moreSettingsButtonClickHandler();
    onUpdateEditedUser(
      userData.dbUserId,
      editedUserData,
      localStorage.getItem('token')
    );
  };

  petProfileHandler = () => {
    this.setState({ petSettings: !this.state.petSettings });
  };

  render() {
    const { userData } = this.props;
    const {
      citiesSelectOptions,
      moreSettings,
      petSettings,
      editedPetState: {
        petName,
        petGender,
        petBreed,
        petAge,
        petWeight,
        petDescription,
      },
      editedUserState: {
        firstName,
        lastName,
        userAge,
        country,
        city,
        description,
      },
    } = this.state;

    let dogBreeds = [];
    let countriesSelect = [];

    DogBreeds.all.forEach((breed) => {
      dogBreeds.push({ value: breed.name, label: breed.name });
    });

    Object.keys(CountryLists).forEach((country) => {
      countriesSelect.push({ value: country, label: country });
    });

    const classInvalid = 'Auth-Input-Invalid';

    const classValid = 'Auth-Input-Valid';

    let userProfile = <Spinner />;
    let classSettings = 'UserProfile-CardHolder';

    if (moreSettings) {
      classSettings = 'UserProfile-CardHolder Open';
    }

    if (Object.values(userData).length > 2 && !petSettings) {
      userProfile = (
        <>
          <div className={classSettings}>
            <CardHolder
              // filteredMatchesLength={filteredMatches.length}
              matchFirstName={userData.firstName}
              matchLastName={userData.lastName}
              matchLocation={userData.location.city}
              userAge={userData.userAge}
            />
          </div>
          <div className={'UserProfile-FormCard'}>
            <form className={'UserProfile-Form'} onSubmit={this.submitHandler}>
              <input
                className={
                  this.isInvalid(
                    firstName.touched,
                    firstName.valid,
                    firstName.value
                  )
                    ? classInvalid
                    : classValid
                }
                value={firstName.value}
                type="text"
                id="firstName"
                name="firstName"
                onChange={(event) =>
                  this.onChangeHandler(
                    event,
                    event.target.id,
                    'editedUserState'
                  )
                }
                placeholder={userData.firstName}
              ></input>

              <input
                className={
                  this.isInvalid(
                    lastName.touched,
                    lastName.valid,
                    lastName.value
                  )
                    ? classInvalid
                    : classValid
                }
                value={lastName.value}
                type="text"
                id="lastName"
                name="lastName"
                onChange={(event) =>
                  this.onChangeHandler(event, event.target.id)
                }
                placeholder={userData.lastName}
              ></input>

              <input
                className={
                  this.isInvalid(userAge.touched, userAge.valid, userAge.value)
                    ? classInvalid
                    : classValid
                }
                value={userAge.value}
                type="number"
                id="userAge"
                name="userAge"
                onChange={(event) =>
                  this.onChangeHandler(event, event.target.id)
                }
                placeholder={userData.userAge}
              ></input>

              <Select
                className={'Auth-Select-Country'}
                name="country"
                options={countriesSelect}
                onChange={(event, name) => this.onChangeHandler(event, name)}
                placeholder={userData.location.country}
              ></Select>

              <Select
                className={'Auth-Select-City'}
                name="city"
                options={citiesSelectOptions}
                isDisabled={!(citiesSelectOptions.length > 1)}
                onChange={(event, name) => this.onChangeHandler(event, name)}
                placeholder={userData.location.city}
              ></Select>

              <input
                className={
                  this.isInvalid(
                    description.touched,
                    description.valid,
                    description.value
                  )
                    ? classInvalid
                    : classValid
                }
                value={description.value}
                type="text"
                id="description"
                name="description"
                onChange={(event) =>
                  this.onChangeHandler(event, event.target.id)
                }
                placeholder={'Description'}
              ></input>
              <button
                className="UserProfile-Button-Submit"
                onClick={this.submitHandler}
                disabled={country.touched && !city.valid}
              >
                Save
              </button>
            </form>
          </div>

          <button
            className={'UserProfile-Button-Edit'}
            onClick={this.moreSettingsButtonClickHandler}
          >
            <i className="fas fa-user-cog fa-2x"></i>
          </button>
        </>
      );
    } else if (Object.values(userData).length > 2 && petSettings) {
      userProfile = (
        <>
          <div className={classSettings}>
            <CardHolder
              isDog={petSettings}
              // filteredMatchesLength={filteredMatches.length}
              matchFirstName={userData.petData.petName}
              matchLocation={userData.userData}
              userAge={userData.petData.petAge}
            />
          </div>

          <div className={'UserProfile-FormCard'}>
            <form className={'UserProfile-Form'} onSubmit={this.submitHandler}>
              <input
                className={
                  this.isInvalid(petName.touched, petName.valid, petName.value)
                    ? classInvalid
                    : classValid
                }
                value={petName.value}
                type="text"
                id="petName"
                name="petName"
                onChange={(event) =>
                  this.onChangeHandler(event, event.target.id)
                }
                placeholder={
                  userData.petData.petName
                    ? userData.petData.petName
                    : "Your Pet's Name"
                }
              ></input>

              <input
                className={
                  this.isInvalid(petAge.touched, petAge.valid, petAge.value)
                    ? classInvalid
                    : classValid
                }
                value={petAge.value}
                type="number"
                id="petAge"
                name="petAge"
                onChange={(event) =>
                  this.onChangeHandler(event, event.target.id)
                }
                placeholder={
                  userData.petData.petAge
                    ? userData.petData.petAge
                    : "Your Pet's Age"
                }
              ></input>

              <input
                className={
                  this.isInvalid(
                    petWeight.touched,
                    petWeight.valid,
                    petWeight.value
                  )
                    ? classInvalid
                    : classValid
                }
                value={petWeight.value}
                type="number"
                id="petWeight"
                name="petWeight"
                onChange={(event) =>
                  this.onChangeHandler(event, event.target.id)
                }
                placeholder={
                  userData.petData.petWeight
                    ? userData.petData.petWeight
                    : "Your Pet's Weight"
                }
              ></input>

              <Select
                className={'Auth-Select-Country'}
                name="petGender"
                options={[
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                ]}
                onChange={(event, name) => this.onChangeHandler(event, name)}
                placeholder={
                  userData.petData.petGender
                    ? userData.petData.petGender
                    : "Select your Pet's Gender"
                }
              ></Select>

              <Select
                className={'Auth-Select-City'}
                name="petBreed"
                options={dogBreeds}
                onChange={(event, name) => this.onChangeHandler(event, name)}
                placeholder={
                  userData.petData.petBreed
                    ? userData.petData.petBreed
                    : "Select your Pet's Breed"
                }
              ></Select>

              <input
                className={
                  this.isInvalid(
                    petDescription.touched,
                    petDescription.valid,
                    petDescription.value
                  )
                    ? classInvalid
                    : classValid
                }
                value={petDescription.value}
                type="text"
                id="petDescription"
                name="petDescription"
                onChange={(event) =>
                  this.onChangeHandler(event, event.target.id)
                }
                placeholder={
                  userData.petData.petDescription
                    ? userData.petData.petDescription
                    : 'Say something about your Dog!'
                }
              ></input>
              <button
                className="UserProfile-Button-Submit"
                onClick={this.submitHandler}
                disabled={country.touched && !city.valid}
              >
                Save
              </button>
            </form>
          </div>

          <button
            className={'UserProfile-Button-Edit'}
            onClick={this.moreSettingsButtonClickHandler}
          >
            <i className="fas fa-user-cog fa-2x"></i>
          </button>
        </>
      );
    }

    return (
      <>
        <div className={'UserProfile-Wrapper'}>{userProfile} </div>
        <button onClick={this.petProfileHandler}>Pet Settings</button>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.matches.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateEditedUser: (editedUserId, editedUserData, token) =>
      dispatch(actions.updateEditedUser(editedUserId, editedUserData, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
