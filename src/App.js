import React, { Component } from "react";
import Match from "./components/Body/Match/Matching";
import Auth from "./components/Body/Auth/Auth";
import NavigationItems from "./components/Navigation/NavigationItems";
import Matched from "./components/Body/Matched/Matched";
import Chat from "./components/Body/Chat/Chat";
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
    const { onFetchMatches } = this.props;

    if (!prevProps.isAuthenticated && this.props.isAuthenticated) {
      onFetchMatches(localStorage.getItem("userId"));
      console.log("im in")
    }
  }

  render() {
    const { history } = this.props;

    let routes = null;
    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/match" component={Match} />
          <Route path="/logout" component={Logout} />
          <Route path="/matched" component={Matched} />
          <Route path="/chat/:id" component={Chat} />
          <Redirect to={history.location.pathname} />
        </Switch>
      );
    } else {
      routes = <Redirect to={this.props.redirectPath}></Redirect>;
    }

    return (
      <CSSTransition
        in={this.props.isAuthenticated}
        appear={true}
        timeout={300}
        classNames="fade"
      >
        <div className="App">
          <Router>
            <NavigationItems />
            {routes}
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignUp: () => dispatch(actions.authCheckState()),
    onFetchMatches: (userId) => dispatch(actions.fetchMatches(userId)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
