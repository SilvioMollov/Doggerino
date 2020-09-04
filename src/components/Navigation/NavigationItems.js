import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
// import * as actions from "../../store/actions/index";

import "./NavigationItems.css";

class navigationItems extends Component {
  render() {
    let logout = (
      <NavLink to="/logout" className="NavLinks">
        Logout
      </NavLink>
    );

    return (
      <ul className="NavigationItems">
        <li className="li">
          {this.props.isAuth ? (
            <span className="WrappingSpan">
              <NavLink to="/match" className="NavLinks">
                Matches
              </NavLink>
              <NavLink to="/matched" className="NavLinks">
                Matched
              </NavLink>
              <NavLink to="chat" className= "NavLinks">
                Chat
              </NavLink>
            </span>
          ) : null}

          {this.props.isAuth ? (
            <span className="WrappingSpan">{logout}</span>
          ) : (
            <NavLink to="/auth" className="NavLinks">
              {!this.props.isSignUp ? "Sing in" : "Sing Up"}
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
  };
};

export default connect(mapStateToProps)(navigationItems);
