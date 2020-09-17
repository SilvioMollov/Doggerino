import React, { Component } from "react";
import Match from "./Match/Match";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Spinner from "../../UI/Spinner/Spinner";
import * as actions from "../../../store/actions/index";

export class Matched extends Component {
  state = {
    likedUsers: [],
    chatPathName: "chat",
  };

  componentDidMount() {
    const { onFetchMatches, onFetchLikedUsers } = this.props;

    onFetchMatches(
      localStorage.getItem("userId"),
      localStorage.getItem("token")
    );
    onFetchLikedUsers(
      localStorage.getItem("userId"),
      localStorage.getItem("token")
    );
  }

  onClickHandler = (clickedUser) => {
    const { history } = this.props;

    history.push(`${this.state.chatPathName}/${clickedUser.userId}`);
  };

  render() {
    const { likedUsersData } = this.props;

    let matches = <Spinner></Spinner>;

    if (likedUsersData.length) {
      matches = likedUsersData.map((user) => (
        <Match
          clickHandler={() => {
            this.onClickHandler(user);
          }}
          key={user.userId}
          id={user.userId}
          matched={user.matched}
          firstName={user.firstName}
          lastName={user.lastName}
          location={user.location.city}
        />
      ));
    }

    return <div>{matches}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    likedUsersData: state.matches.likedUsersData,
    matches: state.matches.matches,
    likedUsers: state.matches.userData.likedUsers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchMatches: (userId, token) =>
      dispatch(actions.fetchMatches(userId, token)),
    onFetchLikedUsers: (userId, token) =>
      dispatch(actions.fetchLikedUsers(userId, token)),
    onMessagedUser: (user, matches) =>
      dispatch(actions.messagedUser(user, matches)),
    onRedirectPath: (path) => dispatch(actions.authRedirectPath(path)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Matched));
