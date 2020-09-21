import React, { Component } from 'react';
import { connect } from 'react-redux';

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

  onChangeHandler = (event, inputType) => {
    const { editedUserState } = this.state;

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

  submitHandler = () => {
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

    console.log(editedUserData);
    onUpdateEditedUser(
      userData.dbUserId,
      editedUserData,
      localStorage.getItem('token')
    );
  };

  render() {
    const { userData } = this.props;
    const {
      citiesSelectOptions,
      moreSettings,
      editedUserState: {
        firstName,
        lastName,
        userAge,
        country,
        city,
        description,
      },
    } = this.state;

    const classInvalid = 'Auth-Input-Invalid';

    const classValid = 'Auth-Input-Valid';

    const countries = Object.keys(CountryLists);

    let countriesSelect = [];

    countries.forEach((country) => {
      countriesSelect.push({ value: country, label: country });
    });

    let userProfile = <Spinner />;
    let classSettings = 'UserProfile-CardHolder';

    if (moreSettings) {
      classSettings = 'UserProfile-CardHolder Open';
    }

    if (Object.values(userData).length > 1) {
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
                  this.onChangeHandler(event, event.target.id)
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
            </form>
            <button
              className="UserProfile-Button-Submit"
              onClick={this.submitHandler}
              disabled={country.touched && !city.valid}
            >
              Save
            </button>
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
        <div className={'UserProfile-Wrapper'}>{userProfile}</div>
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
