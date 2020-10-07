import React, { Component } from "react";
import Match from "./Match/Match";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { AttentionSeeker } from "react-awesome-reveal";

import CardHolder from "../Match/CardHolder/CardHolder";
import Spinner from "../../UI/Spinner/Spinner";
import Modal from "../../UI/Modal/Modal";
import ToolTip from "../../UI/ToolTip/ToolTip";
import * as actions from "../../../store/actions/index";
import "./Matched.css";

export class Matched extends Component {
  state = {
    chatPathName: "chat",
    isViewingUser: false,
    isViewingUserProfile: false,
    viewedUser: {},
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

  onDislikeHandler = (clickedUser) => {
    this.props.onDislikeUser(
      clickedUser.userId,
      localStorage.getItem("userId"),
      localStorage.getItem("token")
    );
  };

  onViewUserProfileHandler = (user) => {
    this.setState({
      isViewingUser: !this.state.isViewingUser,
      viewedUser: user,
    });
  };

  onMessageUserHandler = (clickedUser) => {
    const { history } = this.props;

    history.push(`${this.state.chatPathName}/${clickedUser.userId}`);
  };

  onViewUserHandler = () => {
    this.setState({ isViewingUserProfile: !this.state.isViewingUserProfile });
  };

  render() {
    const { likedUsersData } = this.props;
    const { viewedUser, isViewingUser, isViewingUserProfile } = this.state;

    let userCardHolderClass = "Ontop";

    if (isViewingUserProfile) {
      userCardHolderClass = "Ontop Open";
    }

    let matches = <Spinner></Spinner>;

    if (likedUsersData.length) {
      matches = likedUsersData.map((user) => (
        <Match
          viewUserProfileHandler={() => {
            this.onViewUserProfileHandler(user);
          }}
          messageHandler={() => {
            this.onMessageUserHandler(user);
          }}
          dislikeHandler={() => {
            this.onDislikeHandler(user);
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

    return (
      <div className={"Matched-Wrapper"}>
        <div className={"Matched-Holder"}>
          <Modal show={isViewingUser} closed={this.onViewUserProfileHandler}>
            {isViewingUser ? (
              <div className={"Matching-CardHolderWrapper"}>
                <CardHolder
                  isDog={false}
                  matchFirstName={viewedUser.firstName}
                  matchLastName={viewedUser.lastName}
                  userAge={viewedUser.userAge}
                  matchLocation={viewedUser.location.city}
                />
                <div className={userCardHolderClass}>
                  <CardHolder
                    isDog={true}
                    petGender={
                      viewedUser.petData.petGender
                        ? viewedUser.petData.petGender
                        : "Your Pet's Gender"
                    }
                    petName={
                      viewedUser.petData.petName
                        ? viewedUser.petData.petName
                        : "Your Pet's Name"
                    }
                    petBreed={
                      viewedUser.petData.petBreed
                        ? viewedUser.petData.petBreed
                        : "Breed"
                    }
                    petAge={
                      viewedUser.petData.petAge
                        ? viewedUser.petData.petAge
                        : "Age"
                    }
                    petDescription={viewedUser.petData.petDescription}
                  />
                </div>

                <button
                  className={"Matching-Button-ViewChange"}
                  onClick={this.onViewUserHandler}
                >
                  <AttentionSeeker effect="headShake">
                    <i className="fas fa-user-cog fa-2x"></i>
                  </AttentionSeeker>
                </button>
              </div>
            ) : null}
          </Modal>
          <ToolTip
            header="Hey, again!"
            content="On this page you will find all of the users that you've liked, the ones that liked you back will appear with a colord heart and you can always unlike them by clicking on it"
          >
            {matches}
          </ToolTip>
        </div>
      </div>
    );
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
    onDislikeUser: (dislikedUserId, userId, token) =>
      dispatch(actions.deleteLikedUser(dislikedUserId, userId, token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Matched));
