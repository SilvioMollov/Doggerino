import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import "./NavigationItems.css";

class navigationItems extends Component {
  render() {
    const { isAuth, isSignUp, userData } = this.props;

    let userRoutes = null;

    if (isAuth && Object.entries(userData).length > 1) {
      if (userData.isAdmin) {
        userRoutes = (
          <li>
            <NavLink
              to="/logout"
              className="NavLinks"
              onClick={this.props.onClick}
            >
              Logout
              <i className="fas fa-sign-out-alt"></i>
            </NavLink>
          </li>
        );
      } else {
        userRoutes = (
          <>
           <li>
              <NavLink
                to="/userProfile"
                className="NavLinks"
                onClick={this.props.onClick}
              >
                My Profile
                <i className="fas fa-user"></i>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/match"
                className="NavLinks"
                onClick={this.props.onClick}
              >
                Matches
                <i className="fas fa-users"></i>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/matched"
                className="NavLinks"
                onClick={this.props.onClick}
              >
                Matched
                <i className="fas fa-heart"></i>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/logout"
                className="NavLinks"
                onClick={this.props.onClick}
              >
                Logout
                <i className="fas fa-sign-out-alt"></i>
              </NavLink>
            </li>
          </>
        );
      }
    } else {
      userRoutes = (
        <li>
          <NavLink to="/auth" className="NavLinks" onClick={this.props.onClick}>
            {!isSignUp ? "Sing in" : "Sing Up"}
            <i className="fas fa-sign-in-alt"></i>
          </NavLink>
        </li>
      );
    }

    return <ul className="NavigationItems">{userRoutes}</ul>;
  }
}

const mapStateToProps = (state) => {
  return {
    authRedirectPath: state.auth.authRedirectPath,
    isAuth: state.auth.token !== null,
    isSignUp: state.auth.isSignUp,
    userData: state.matches.userData,
  };
};

export default connect(mapStateToProps)(navigationItems);
