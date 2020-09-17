import React, { Component } from "react";
import { connect } from "react-redux";

import "./UserProfile.css";
import Spinner from "../../UI/Spinner/Spinner";
import CardHolder from "../Match/CardHolder/CardHolder";

export class UserProfile extends Component {
  state = {
    moreSettings: false,
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
      location: {
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
    },
  };

  moreSettingsButtonClickHandler = () => {
    this.setState({ moreSettings: !this.state.moreSettings });
    console.log(this.state.moreSettings);
  };

  render() {
   
    const { userData } = this.props;
    const { moreSettings } = this.state;

    let userProfile = <Spinner />;
    let classSettings = "UserProfile-CardHolder";

    if (moreSettings) {
        classSettings = 'UserProfile-CardHolder Open'
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
            />
          </div>
          <button onClick={this.moreSettingsButtonClickHandler}>
            More Settings
          </button>
          <form>
            <p>
              <strong>First Name:</strong> {userData.firstName}
            </p>

            <input
              className={"Admin-Input-Label"}
              value={userData.firstName}
              type="text"
              id="firstName"
              name="firstName"
              onChange={(event) => this.onChangeHandler(event, event.target.id)}
              placeholder="NEW First Name"
            ></input>

            <p>
              <strong>Last Name:</strong> {userData.lastName}
            </p>

            <input
              className={"Admin-Input-Label"}
              value={userData.lastName}
              type="text"
              id="lastName"
              name="lastName"
              onChange={(event) => this.onChangeHandler(event, event.target.id)}
              placeholder="NEW Last Name"
            ></input>

            <p>
              <strong>Location:</strong> {userData.location.city}
            </p>
            <input
              className={"Admin-Input-Label"}
              value={userData.location.city}
              type="text"
              id="location"
              name="location"
              onChange={(event) => this.onChangeHandler(event, event.target.id)}
              placeholder="NEW Location"
            ></input>
          </form>
        </>
      );
    }

    return (
      <>
        <div className="UserProfile-Wrapper">{userProfile}</div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.matches.userData,
  };
};

export default connect(mapStateToProps)(UserProfile);
