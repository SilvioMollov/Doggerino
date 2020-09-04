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
} from "react-router-dom";
import Logout from "./components/Body/Logout/logout";
import * as actions from "./store/actions/index";
import { connect } from "react-redux";

import "./App.css";

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignUp();
  }

  render() {
    let routes = null;
    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/match" component={Match} />
          <Route path="/logout" component={Logout} />
          <Route path="/matched" component={Matched} />
          <Route path="/chat" component={Chat} />
        </Switch>
      );
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
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
