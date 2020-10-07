import React, { Component } from "react";
import { connect } from "react-redux";
import DogBreeds from "dog-breeds";
import { AttentionSeeker } from "react-awesome-reveal";
import { processValidity } from "../../../shared/utility";

import * as actions from "../../../store/actions/index";
import "./UserProfile.css";
import CountryLists from "all-countries-and-cities-json";
import Spinner from "../../UI/Spinner/Spinner";
import CardHolder from "../Match/CardHolder/CardHolder";
import Select from "react-select";
import ToolTip from "../../UI/ToolTip/ToolTip";
import ToggleBar from "../../UI/ToggleBar/ToggleBar";

export class UserProfile extends Component {
  state = {
    citiesSelectOptions: [{}],
    moreSettings: false,
    petSettings: false,
    editedPetState: {
      petName: {
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      petAge: {
        value: "",
        validation: {
          required: true,
          maxAge: 12,
          maxLength: 2,
        },
        valid: false,
        touched: false,
      },
      petBreed: {
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      petGender: {
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      petWeight: {
        value: "",
        validation: {
          required: true,
          maxLength: 2,
        },
        valid: false,
        touched: false,
      },
      petDescription: {
        value: "",
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
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      lastName: {
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      userAge: {
        value: "",
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
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      city: {
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      description: {
        value: "",
        validation: {
          required: false,
          maxLength: 300,
        },
        valid: false,
        touched: false,
      },
    },
  };

  onChangeHandler = (event, inputType, stateType) => {
    const { editedUserState, editedPetState } = this.state;

    switch (stateType) {
      case "editedUserState":
        let updatedUser = {};

        if (Boolean(inputType.action)) {
          let citySelect = [];

          if (inputType.name === "country") {
            CountryLists[event.value].forEach((city) =>
              citySelect.push({ value: city, label: city })
            );
            this.setState({ citiesSelectOptions: citySelect });
          }

          updatedUser = {
            ...editedUserState,
            [inputType.name]: {
              ...editedUserState[inputType.name],
              value: event.value,
              valid: processValidity(
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
              valid: processValidity(
                event.target.value,
                editedUserState[inputType]
              ),
              touched: true,
            },
          };
        }

        this.setState({ editedUserState: updatedUser });

        break;

      case "editedPetState":
        let updatedPetState = {};

        if (Boolean(inputType.action)) {
          updatedPetState = {
            ...editedPetState,
            [inputType.name]: {
              ...editedPetState[inputType.name],
              value: event.value,
              valid: processValidity(
                event.value,
                editedPetState[inputType.name]
              ),
              touched: true,
            },
          };
        } else {
          updatedPetState = {
            ...editedPetState,
            [inputType]: {
              ...editedPetState[inputType],
              value: event.target.value,
              valid: processValidity(
                event.target.value,
                editedPetState[inputType]
              ),
              touched: true,
            },
          };
        }

        this.setState({ editedPetState: updatedPetState });

        break;
      default:
        console.log("ERROR");
    }
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

        console.log(editedUserState[propType]);

        this.setState((state) => {
          return (
            (state.editedUserState[propType].value = ""),
            (state.editedUserState[propType].valid = false),
            (state.editedUserState[propType].touched = false)
          );
        });
      }
    }
  };

  isInvalid = (touched, valid, value) => {
    return touched && !valid && value;
  };

  submitHandler = (e, stateType) => {
    e.preventDefault();

    const { editedUserState, editedPetState } = this.state;
    const { onUpdateEditedUser, userData } = this.props;

    if (stateType === "editedUserState") {
      let editedUserData = {};

      for (let propType in editedUserState) {
        if (
          editedUserState[propType].valid &&
          editedUserState[propType].touched
        ) {
          editedUserData = {
            ...editedUserData,
            location: {
              country: Boolean(editedUserState["country"].value)
                ? editedUserState["country"].value
                : userData.location.country,
              city: Boolean(editedUserState["city"].value)
                ? editedUserState["city"].value
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
        localStorage.getItem("token"),
        false
      );
    } else {
      let editedPetUserData = {};

      for (let propType in editedPetState) {
        if (
          editedPetState[propType].valid &&
          editedPetState[propType].touched
        ) {
          editedPetUserData = {
            ...editedPetUserData,
            [propType]: editedPetState[propType].value,
          };
        }
      }
      this.moreSettingsButtonClickHandler();
      onUpdateEditedUser(
        userData.dbUserId,
        editedPetUserData,
        localStorage.getItem("token"),
        true
      );
    }
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
        petAge,
        petWeight,
        petGender,
        petBreed,
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

    const classInvalid = "Auth-Input-Invalid";

    const classValid = "Auth-Input-Valid";

    let userProfile = <Spinner />;
    let userCardHolderClass = "UserProfile-Card-OnTop";

    if (moreSettings) {
      userCardHolderClass = "UserProfile-Card-OnTop Open";
    }

    if (Object.values(userData).length > 2 && !petSettings) {
      userProfile = (
        <>
          <form
            className={"UserProfile-Form"}
            onSubmit={(event) => this.submitHandler(event, "editedUserState")}
          >
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
                this.onChangeHandler(event, event.target.id, "editedUserState")
              }
              placeholder={userData.firstName}
            ></input>

            <input
              className={
                this.isInvalid(lastName.touched, lastName.valid, lastName.value)
                  ? classInvalid
                  : classValid
              }
              value={lastName.value}
              type="text"
              id="lastName"
              name="lastName"
              onChange={(event) =>
                this.onChangeHandler(event, event.target.id, "editedUserState")
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
                this.onChangeHandler(event, event.target.id, "editedUserState")
              }
              placeholder={userData.userAge}
            ></input>

            <Select
              className={"Auth-Select-Country"}
              name="country"
              options={countriesSelect}
              onChange={(event, name) =>
                this.onChangeHandler(event, name, "editedUserState")
              }
              placeholder={userData.location.country}
            ></Select>

            <Select
              className={"Auth-Select-City"}
              name="city"
              options={citiesSelectOptions}
              isDisabled={!(citiesSelectOptions.length > 1)}
              onChange={(event, name) =>
                this.onChangeHandler(event, name, "editedUserState")
              }
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
                this.onChangeHandler(event, event.target.id, "editedUserState")
              }
              placeholder={"Description"}
            ></input>
            <button
              className="UserProfile-Button-Submit"
              onClick={(event) => this.submitHandler(event, "editedUserState")}
              disabled={country.touched && !city.valid}
            >
              Save
            </button>
          </form>

          <div className={userCardHolderClass}>
            <div className={"UserProfile-CardHolder"}>
              <CardHolder
                // filteredMatchesLength={filteredMatches.length}
                matchFirstName={userData.firstName}
                matchLastName={userData.lastName}
                matchLocation={userData.location.city}
                userAge={userData.userAge}
              />
            </div>
          </div>
        </>
      );
    } else if (Object.values(userData).length > 2 && petSettings) {
      userProfile = (
        <>
          <form
            className={"UserProfile-Form"}
            onSubmit={(event) => this.submitHandler(event, "editedPetState")}
          >
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
                this.onChangeHandler(event, event.target.id, "editedPetState")
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
                this.onChangeHandler(event, event.target.id, "editedPetState")
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
                this.onChangeHandler(event, event.target.id, "editedPetState")
              }
              placeholder={
                userData.petData.petWeight
                  ? userData.petData.petWeight
                  : "Your Pet's Weight"
              }
            ></input>

            <Select
              className={"UserProfile-Select"}
              name="petGender"
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
              onChange={(event, name) =>
                this.onChangeHandler(event, name, "editedPetState")
              }
              placeholder={
                userData.petData.petGender
                  ? userData.petData.petGender
                  : "Select your Pet's Gender"
              }
            ></Select>

            <Select
              className={"UserProfile-Select"}
              name="petBreed"
              options={dogBreeds}
              onChange={(event, name) =>
                this.onChangeHandler(event, name, "editedPetState")
              }
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
                this.onChangeHandler(event, event.target.id, "editedPetState")
              }
              placeholder={
                userData.petData.petDescription
                  ? userData.petData.petDescription
                  : "Say something about your Dog!"
              }
            ></input>

            <button
              className="UserProfile-Button-Submit"
              onClick={(event) => this.submitHandler(event, "editedPetState")}
              disabled={
                !(
                  petName.valid &&
                  petAge.valid &&
                  petWeight.valid &&
                  petGender.valid &&
                  petBreed.valid
                )
              }
            >
              Save
            </button>
          </form>
          <div className={userCardHolderClass}>
            <div className={"UserProfile-CardHolder"}>
              <CardHolder
                isDog={petSettings}
                petGender={
                  userData.petData.petGender
                    ? userData.petData.petGender
                    : "Your Pet's Gender"
                }
                petName={
                  userData.petData.petName
                    ? userData.petData.petName
                    : "Your Pet's Name"
                }
                petBreed={
                  userData.petData.petBreed
                    ? userData.petData.petBreed
                    : "Breed"
                }
                petAge={
                  userData.petData.petAge ? userData.petData.petAge : "Age"
                }
                petDescription={userData.petData.petDescription}
              />
            </div>
          </div>
        </>
      );
    }

    return (
      <div className={"UserProfile-Wrapper"}>
        <div className={"UserProfile-Holder"}>
          <ToolTip
            header={"Hello there!"}
            content={
              "On this page you can edit your own profile, and your dog's profile aswell! Keep in mind that if your dog's profile remains empty, you wont appear as a match!"
            }
          >
            <h3 className="UserProfile-Header">Welcome {userData.firstName}</h3>
            <div className={"UserProfile-CardHolder-Wrapper"}>
              {userProfile}
              <button
                className={"UserProfile-Button-Edit"}
                onClick={this.moreSettingsButtonClickHandler}
              >
                <AttentionSeeker effect="headShake">
                  <i className="fas fa-user-cog fa-2x"></i>
                </AttentionSeeker>
              </button>
            </div>
          </ToolTip>
        </div>
        <ToggleBar
          clicked={this.petProfileHandler}
          icons={
            <>
              <i className="fas fa-dog fa-2x "></i>
              <i className="fas fa-user fa-2x "></i>
            </>
          }
        />
      </div>
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
    onUpdateEditedUser: (editedUserId, editedUserData, token, isPetData) =>
      dispatch(
        actions.updateEditedUser(editedUserId, editedUserData, token, isPetData)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
