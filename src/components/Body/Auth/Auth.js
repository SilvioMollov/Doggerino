import React, { Component } from "react";
import "./Auth.css";
import CountryLists from "all-countries-and-cities-json";
import Select from "react-select";

import * as actions from "../../../store/actions/index";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class Auth extends Component {
  state = {
    citiesSelectOptions: [{}],
    user: {
      email: {
        value: "",
        validation: {
          required: true,
          mailFormat: true,
        },
        valid: false,
        touched: false,
      },
      password: {
        value: "",
        validation: {
          required: true,
          minLength: 6,
        },
        valid: false,
        touched: false,
      },
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
    },
  };

  processValidity = (value, rules) => {
    let isValid = true;
    const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.mailFormat) {
      isValid = value.match(mailFormat) && isValid;
    }

    return isValid;
  };

  onChangeHandler = (event, inputType) => {
    const updatedUser = {
      ...this.state.user,
      [inputType]: {
        ...this.state.user[inputType],
        value: event.target.value,
        valid: this.processValidity(
          event.target.value,
          this.state.user[inputType].validation
        ),
        touched: true,
      },
    };

    this.setState({ user: updatedUser });
  };

  onSwithToSignInHandler = () => {
    this.props.onIsSignUp();

    for (const obj in this.state.user) {
      if (this.state.user[obj].touched) {
        this.setState((state) => {
          state.user[obj].value = "";
        });
      }
    }
  };

  onSubmitHandler = (event) => {
    event.preventDefault();

    if (this.props.isSignUp) {
      this.props.onSignUp(
        this.state.user.email.value,
        this.state.user.password.value,
        this.state.user.location.value,
        this.state.user.firstName.value,
        this.state.user.lastName.value,
        this.props.isSignUp,
        this.props.userId
      );
    } else {
      this.props.onSignIn(
        this.state.user.email.value,
        this.state.user.password.value
      );
    }
  };

  onKeyPressHandler = (e) => {
    if (e.key === "Enter") {
      this.onSubmitHandler(e);
    }
  };

  onChangeSelectHandler = ({ value }, { name }) => {
    let citiesSelect = [];

    if (name === "country") {
      CountryLists[value].forEach((city) =>
        citiesSelect.push({ value: city, label: city })
      );
      this.setState({ citiesSelectOptions: citiesSelect });
    }

    const updatedUser = {
      ...this.state.user,
      [name]: {
        ...this.state.user[name],
        value: value,
        valid: this.processValidity(value, this.state.user[name].validation),
        touched: true,
      },
    };

    this.setState({ user: updatedUser });
  };

  isInvalid = (touched, valid, value) => {
    return touched && !valid && value;
  };

  render() {
    const {
      citiesSelectOptions,
      user: { email, password, country, city, firstName, lastName },
    } = this.state;

    const countries = Object.keys(CountryLists);

    let countriesSelect = [];

    console.log(
      this.isInvalid(password.touched, password.valid, password.value)
    );

    countries.forEach((country) => {
      countriesSelect.push({ value: country, label: country });
    });

    const classInvalid = "Auth-Input-Invalid";

    const classValid = "Auth-Input-Valid";

    let form = (
      <form
        className={"Auth-Form"}
        onSubmit={(event) => this.onSubmitHandler(event)}
      >
        <h3 className={"Auth-Header"}>Sign In</h3>
        {/* <h2>
  {this.state.initialState.error !== null
    ? `${this.state.initialState.error.message}`
    : null}
</h2> */}
        <input
          className={classValid}
          value={this.state.user.email.value}
          type="email"
          id="email"
          name="email"
          onChange={(event) => this.onChangeHandler(event, event.target.id)}
          placeholder="Your Email"
        ></input>

        <input
          className={classValid}
          value={this.state.user.password.value}
          type="password"
          id="password"
          name="password"
          onKeyPress={this.onKeyPressHandler}
          onChange={(event) => this.onChangeHandler(event, event.target.id)}
          placeholder="Password"
        ></input>
      </form>
    );

    let err = null;

    if (this.props.error) {
      err = <h2>{this.props.error.message}</h2>;
    }

    let authRedirect = null;

    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={this.props.authRedirectPath} />;
    }

    if (this.props.isSignUp) {
      form = (
        <form
          className={"Auth-Form"}
          onSubmit={(event) => this.onSubmitHandler(event)}
        >
          <h3 className={"Auth-Header"}>Sign Up</h3>
          <input
            className={
              this.isInvalid(email.touched, email.valid, email.value)
                ? classInvalid
                : classValid
            }
            value={email.value}
            type="email"
            id="email"
            name="email"
            onChange={(event) => this.onChangeHandler(event, event.target.id)}
            placeholder="Your Email"
          ></input>

          <input
            className={
              this.isInvalid(password.touched, password.valid, password.value)
                ? classInvalid
                : classValid
            }
            value={password.value}
            type="password"
            id="password"
            name="password"
            onChange={(event) => this.onChangeHandler(event, event.target.id)}
            placeholder="Password"
          ></input>

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
            onChange={(event) => this.onChangeHandler(event, event.target.id)}
            placeholder="First Name"
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
            onChange={(event) => this.onChangeHandler(event, event.target.id)}
            placeholder="Last Name"
          ></input>

          <Select
            className={"Auth-Select-Country"}
            name="country"
            options={countriesSelect}
            onChange={this.onChangeSelectHandler}
            placeholder={"Country"}
          ></Select>

          <Select
            className={"Auth-Select-City"}
            name="city"
            options={citiesSelectOptions}
            isDisabled={!(citiesSelectOptions.length > 1)}
            onChange={this.onChangeSelectHandler}
            placeholder={"City"}
          ></Select>
        </form>
      );
    }

    return (
      <div className="Auth">
        {authRedirect}
        {err}
        {form}
        <div>
          <button
            className="Auth-Button-Confirm"
            onClick={this.onSubmitHandler}
          >
            {this.props.isSignUp ? "Sign Up" : "Sign In"}
            {this.props.isSignUp ? (
              <i className="fas fa-user-plus"></i>
            ) : (
              <i className="fas fa-sign-in-alt"></i>
            )}
          </button>

          <button className="Auth-Button" onClick={this.onSwithToSignInHandler}>
            Swith to {this.props.isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: state.auth.error,
    isAuthenticated: state.auth.token,
    authRedirectPath: state.auth.authRedirectPath,
    isSignUp: state.auth.isSignUp,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignUp: (
      email,
      password,
      location,
      firstName,
      lastName,
      isSignUp,
      userId
    ) =>
      dispatch(
        actions.signUp(
          email,
          password,
          location,
          firstName,
          lastName,
          isSignUp,
          userId
        )
      ),
    onSetAuthRedirectPath: (path) => dispatch(actions.authRedirectPath(path)),
    onSignIn: (email, password) => dispatch(actions.signIn(email, password)),
    onIsSignUp: () => dispatch(actions.authIsSignUp()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
