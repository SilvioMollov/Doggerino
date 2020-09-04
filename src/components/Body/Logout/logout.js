import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as actions from "../../../store/actions/index";

class Logout extends Component {
  componentDidMount() {
    this.props.onLogOut("/auth");
    this.props.onClearState();
  }

  render() {
    return <Redirect to="/auth" />;
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    authRedirectPath: state.auth.authRedirectPath,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogOut: (path) => dispatch(actions.logout(path)),
    onClearState: () => dispatch(actions.clearStateMatches()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
