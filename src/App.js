import React, { Component } from "react";
import Match from "./components/Body/Match/Matching";
import Auth from "./components/Body/Auth/Auth";
import Matched from "./components/Body/Matched/Matched";
import Chat from "./components/Body/Chat/Chat";
import Admin from "./components/Admin/Admin";
import Layout from "./hoc/Layout/Layout";
import { CSSTransition } from "react-transition-group";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  Redirect,
} from "react-router-dom";
import Logout from "./components/Body/Logout/logout";
import * as actions from "./store/actions/index";
import { connect } from "react-redux";

import "./App.css";

class App extends Component {
  componentDidMount() {
    const { onTryAutoSignUp } = this.props;

    onTryAutoSignUp();
  }

  componentDidUpdate(prevProps) {
    const { onFetchMatches, isAuthenticated } = this.props;

    if (!prevProps.isAuthenticated && isAuthenticated) {
      onFetchMatches(
        localStorage.getItem("userId"),
        localStorage.getItem("token")
      );
    }
  }

  render() {
    const { history, userData } = this.props;

    let routes = null;

    if (this.props.isAuthenticated) {
      if (userData.isAdmin) {
        routes = (
          <Switch>
            <Route path="/admin" component={Admin} />
            <Route path="/logout" component={Logout} />
            <Redirect to={"admin"} />
          </Switch>
        );
      } else {
        routes = (
          <Switch>
            <Route exact path="/match" component={Match} />
            <Route path="/logout" component={Logout} />
            <Route path="/matched" component={Matched} />
            <Route path="/chat/:id" component={Chat} />
            <Redirect to={history.location.pathname} />
          </Switch>
        );
      }
    } else {
      routes = <Redirect to={this.props.redirectPath}></Redirect>;
    }

    return (
      <CSSTransition
        in={this.props.isAuthenticated}
        appear={false}
        timeout={300}
        classNames="fade"
      >
        <div className="App">
          <Router>
            <Layout>{routes}</Layout>
            <Route path="/auth" component={Auth} />
          </Router>
        </div>
      </CSSTransition>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    redirectPath: state.auth.authRedirectPath,
    isAuthenticated: state.auth.token !== null,
    userData: state.matches.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignUp: () => dispatch(actions.authCheckState()),
    onFetchMatches: (userId, token) =>
      dispatch(actions.fetchMatches(userId, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
