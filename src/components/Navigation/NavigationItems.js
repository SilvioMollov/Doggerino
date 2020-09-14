import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
// import * as actions from "../../store/actions/index";

import "./NavigationItems.css";

class navigationItems extends Component {
  render() {
    const { isAuth, isSignUp, userData } = this.props;

    let userRoutes = null;

    if (isAuth && Object.entries(userData).length > 1) {
      if (userData.isAdmin) {
        userRoutes = (
          <li>
            <NavLink to="/logout" className="NavLinks">
              Logout
            </NavLink>
          </li>
        );
      } else {
        userRoutes = (
          <>
            <li>
              <NavLink to="/match" className="NavLinks">
                Matches
              </NavLink>
            </li>
            <li>
              <NavLink to="/matched" className="NavLinks">
                Matched
              </NavLink>
            </li>
            <li>
              <NavLink to="/logout" className="NavLinks">
                Logout
              </NavLink>
            </li>
          </>
        );
      }
    } else {
      userRoutes = (
        <NavLink to="/auth" className="NavLinks">
          {!isSignUp ? "Sing in" : "Sing Up"}
        </NavLink>
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
