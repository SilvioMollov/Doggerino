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

    onFetchMatches(localStorage.getItem("userId"));
    onFetchLikedUsers(
      localStorage.getItem("userId"),
      localStorage.getItem("token")
    );
    // this.props.onSetLikedUsers(this.props.matches, this.props.likedUsers);
  }

  onClickHandler = (clickedUser) => {
    const { onMessagedUser } = this.props;

    this.props.history.push(this.state.chatPathName);
    onMessagedUser(clickedUser);
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
          location={user.location}
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
    onFetchMatches: (userId) => dispatch(actions.fetchMatches(userId)),
    onFetchLikedUsers: (userId, token) =>
      dispatch(actions.fetchLikedUsers(userId, token)),
    onMessagedUser: (user) => dispatch(actions.messagedUser(user)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Matched));
