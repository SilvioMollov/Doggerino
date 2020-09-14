import React, { Component } from "react";
import "./Auth.css";

import * as actions from "../../../store/actions/index";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

class Auth extends Component {
  state = {
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
      location: {
        value: "",
        validation: {
          required: true,
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
    },
  };

  checkValidity = (value, rules) => {
    let isValid = true;
    const mailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.mailFormat) {
      isValid = value.match(mailFormat);
    }

    return isValid;
  };

  onChangeHandler = (event, inputType) => {
    const updatedUser = {
      ...this.state.user,
      [inputType]: {
        ...this.state.user[inputType],
        value: event.target.value,
        valid: this.checkValidity(
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

  render() {
    // for (let el of userFormArray) {
    //   console.log(el.id, el.config.valid);
    // }
    let classInvalid = "Auth-Input-Invalid";

    let classValid = "Auth-Input-Valid";

    const emailIsValid =
      this.state.user.email.touched &&
      !this.state.user.email.valid &&
      this.state.user.email.value;

    const passwordIsValid =
      this.state.user.password.touched &&
      !this.state.user.password.valid &&
      this.state.user.password.value;

    const locationIsValid =
      this.state.user.location.touched &&
      !this.state.user.location.valid &&
      this.state.user.location.value;

    const firstNameIsValid =
      this.state.user.firstName.touched &&
      !this.state.user.firstName.valid &&
      this.state.user.firstName.value;

    const lastNameIsValid =
      this.state.user.lastName.touched &&
      !this.state.user.lastName.valid &&
      this.state.user.lastName.value;

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
            className={emailIsValid ? classInvalid : classValid}
            value={this.state.user.email.value}
            type="email"
            id="email"
            name="email"
            onChange={(event) => this.onChangeHandler(event, event.target.id)}
            placeholder="Your Email"
          ></input>

          <input
            className={passwordIsValid ? classInvalid : classValid}
            value={this.state.user.password.value}
            type="password"
            id="password"
            name="password"
            onChange={(event) => this.onChangeHandler(event, event.target.id)}
            placeholder="Password"
          ></input>

          <input
            className={locationIsValid ? classInvalid : classValid}
            value={this.state.user.location.value}
            type="text"
            id="location"
            name="location"
            onChange={(event) => this.onChangeHandler(event, event.target.id)}
            placeholder="Location"
          ></input>

          <input
            className={firstNameIsValid ? classInvalid : classValid}
            value={this.state.user.firstName.value}
            type="text"
            id="firstName"
            name="firstName"
            onChange={(event) => this.onChangeHandler(event, event.target.id)}
            placeholder="First Name"
          ></input>

          <input
            className={lastNameIsValid ? classInvalid : classValid}
            value={this.state.user.lastName.value}
            type="text"
            id="lastName"
            name="lastName"
            onChange={(event) => this.onChangeHandler(event, event.target.id)}
            placeholder="Last Name"
          ></input>
        </form>
      );
    }

    return (
      <div className="Auth">
        {authRedirect}
        {err}
        {form}
        <div>
          <button className="Auth-Button-Confirm" onClick={this.onSubmitHandler}>
            {this.props.isSignUp ? "Sign Up" : "Sign In"}
          </button>

          <button
            className="Auth-Button"
            onClick={this.onSwithToSignInHandler}
          >
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
