import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
// import * as actions from "../../store/actions/index";

import "./NavigationItems.css";

class navigationItems extends Component {
  render() {
    const { isAuth, isSignUp, userData } = this.props;

    let logout = (
      <NavLink to="/logout" className="NavLinks">
        Logout
      </NavLink>
    );

    let matchAndMatched = null;


    if (isAuth && Object.entries(userData).length > 1) {
      if (userData.isAdmin) {
        matchAndMatched = null;
      } else {
        matchAndMatched = (
          <span className="WrappingSpan">
            <NavLink to="/match" className="NavLinks">
              Matches
            </NavLink>
            <NavLink to="/matched" className="NavLinks">
              Matched
            </NavLink>
          </span>
        );
      }
    }

    return (
      <ul className="NavigationItems">
        <li className="li">
          {matchAndMatched}

          {isAuth ? (
            <span className="WrappingSpan">{logout}</span>
          ) : (
            <NavLink to="/auth" className="NavLinks">
              {!isSignUp ? "Sing in" : "Sing Up"}
            </NavLink>
          )}
        </li>
      </ul>
    );
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
