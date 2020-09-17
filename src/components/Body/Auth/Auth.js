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
      confirmPassword: {
        value: "",
        validation: {
          required: true,
          minLength: 6,
          matching: true,
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
    },
  };

  processValidity = (value, inputType) => {
    const { password } = this.state.user;
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
      isValid = value.trim() !== "" && isValid;
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
      isValid = value.length === maxLength && isValid;
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
    const { user } = this.state;

    let updatedUser = {};

    if (inputType.name === "country" || inputType.name === "city") {
      let citiesSelect = [];

      if (inputType.name === "country") {
        CountryLists[event.value].forEach((city) =>
          citiesSelect.push({ value: city, label: city })
        );
        this.setState({ citiesSelectOptions: citiesSelect });
      }

      updatedUser = {
        ...user,
        [inputType.name]: {
          ...user[inputType.name],
          value: event.value,
          valid: this.processValidity(event.value, user[inputType.name]),
          touched: true,
        },
      };
    } else {
      updatedUser = {
        ...user,
        [inputType]: {
          ...user[inputType],
          value: event.target.value,
          valid: this.processValidity(event.target.value, user[inputType]),
          touched: true,
        },
      };
    }

    this.setState({ user: updatedUser });
  };

  onSwithToSignInHandler = () => {
    this.props.onIsSignUp();

    for (const obj in this.state.user) {
      if (this.state.user[obj].touched) {
        if (this.state.user.country.touched) {
          this.setState((state) => {
            state.citiesSelectOptions = [{}];
          });
        }

        this.setState((state) => {
          return (
            (state.user[obj].value = ""),
            (state.user[obj].valid = false),
            (state.user[obj].touched = false)
          );
        });
      }
    }
  };

  onSubmitHandler = (event) => {
    const {
      user: {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        userAge,
        country,
        city,
      },
    } = this.state;

    event.preventDefault();

    if (this.props.isSignUp) {
      this.props.onSignUp(
        email.value,
        password.value,
        confirmPassword.value,
        firstName.value,
        lastName.value,
        userAge.value,
        country.value,
        city.value,
        this.props.isSignUp,
        this.props.userId
      );
    } else {
      this.props.onSignIn(email.value, password.value);
    }
  };

  onKeyPressHandler = (e) => {
    const { isSignUp } = this.props;
    const {
      user: {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        userAge,
        country,
        city,
      },
    } = this.state;

    let formIsValid = true;

    if (isSignUp) {
      formIsValid =
        email.valid &&
        password.valid &&
        confirmPassword.valid &&
        firstName.valid &&
        lastName.valid &&
        userAge.valid &&
        country.valid &&
        city.valid;
    }

    if (e.key === "Enter" && formIsValid) {
      this.onSubmitHandler(e);
    }
  };

  isInvalid = (touched, valid, value) => {
    return touched && !valid && value;
  };

  render() {
    const {
      citiesSelectOptions,
      user: {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        userAge,
        country,
        city,
      },
    } = this.state;

    const countries = Object.keys(CountryLists);

    let countriesSelect = [];

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
                confirmPassword.touched,
                confirmPassword.valid,
                confirmPassword.value
              )
                ? classInvalid
                : classValid
            }
            value={confirmPassword.value}
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            onChange={(event) => this.onChangeHandler(event, event.target.id)}
            placeholder="Confirm Password"
            disabled={!password.value}
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
            onChange={(event) => this.onChangeHandler(event, event.target.id)}
            placeholder="Your Age"
          ></input>

          <Select
            className={"Auth-Select-Country"}
            name="country"
            options={countriesSelect}
            onChange={(event, name) => this.onChangeHandler(event, name)}
            placeholder={"Country"}
          ></Select>

          <Select
            className={"Auth-Select-City"}
            name="city"
            options={citiesSelectOptions}
            isDisabled={!(citiesSelectOptions.length > 1)}
            onChange={(event, name) => this.onChangeHandler(event, name)}
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
            disabled={
              this.props.isSignUp &&
              !(
                email.valid &&
                password.valid &&
                confirmPassword.valid &&
                firstName.valid &&
                lastName.valid &&
                userAge.valid &&
                country.valid &&
                city.valid
              )
            }
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
      confirmPassword,
      firstName,
      lastName,
      userAge,
      country,
      city,
      isSignUp,
      userId
    ) =>
      dispatch(
        actions.signUp(
          email,
          password,
          confirmPassword,
          firstName,
          lastName,
          userAge,
          country,
          city,
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
