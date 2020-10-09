import React, { Component } from "react";
import Match from "./Match/Match";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { AttentionSeeker } from "react-awesome-reveal";

import CardHolder from "../Match/CardHolder/CardHolder";
import Spinner from "../../UI/Spinner/Spinner";
import Modal from "../../UI/Modal/Modal";
import ToolTip from "../../UI/ToolTip/ToolTip";
import ToggleBar from "../../UI/ToggleBar/ToggleBar";
import * as actions from "../../../store/actions/index";
import "./Matched.css";

export class Matched extends Component {
  state = {
    chatPathName: "chat",
    isViewingUser: false,
    viewMoreInfo: false,
    viewDogProfile: false,
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

  onViewMoreInfoHandler = () => {
    this.setState({ viewMoreInfo: !this.state.viewMoreInfo });
  };

  onViewSwitchHandler = () => {
    this.setState({ viewDogProfile: !this.state.viewDogProfile });
  };

  render() {
    const { likedUsersData, userData } = this.props;
    const {
      viewedUser,
      isViewingUser,
      viewMoreInfo,
      viewDogProfile,
    } = this.state;

    let userCardHolderClass = "Ontop";

    if (viewMoreInfo) {
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
          <h3 className="Matched-Header">Welcome {userData.firstName}</h3>
          <Modal show={isViewingUser} closed={this.onViewUserProfileHandler}>
            {isViewingUser ? (
              <div className="Matched-Model-Holder">
                {viewDogProfile ? (
                  <div className={"Matched-CardHolderWrapper"}>
                    <div className={userCardHolderClass}>
                      <CardHolder
                        isDog={true}
                        petGender={viewedUser.petData.petGender}
                        petName={viewedUser.petData.petName}
                        petBreed={viewedUser.petData.petBreed}
                        petAge={viewedUser.petData.petAge}
                        petDescription={viewedUser.petData.petDescription}
                      />
                    </div>
                    <div className={"Matched-Information"}>
                      <p>{viewedUser.petData.petName}</p>
                      <p>{viewedUser.petData.petBreed}</p>
                      <p>{viewedUser.petData.petGender}</p>
                      <p>{viewedUser.petData.petAge}</p>
                      <p>{viewedUser.petData.petDescription}</p>
                    </div>

                    <button
                      className={"Matching-Button-ViewChange"}
                      onClick={this.onViewMoreInfoHandler}
                    >
                      <AttentionSeeker effect="headShake">
                        <i className="fas fa-user-cog fa-2x"></i>
                      </AttentionSeeker>
                    </button>
                  </div>
                ) : (
                  <div className={"Matching-CardHolderWrapper"}>
                    <div className={userCardHolderClass}>
                      <CardHolder
                        isDog={false}
                        matchFirstName={viewedUser.firstName}
                        matchLastName={viewedUser.lastName}
                        userAge={viewedUser.userAge}
                        matchLocation={viewedUser.location.city}
                      />
                    </div>
                    <div className={"Matched-Information"}>
                      <p>{viewedUser.firstName}</p>
                      <p>{viewedUser.lastName}</p>
                      <p>{viewedUser.email}</p>
                      <p>{viewedUser.location.city}</p>
                      <p>{viewedUser.description}</p>
                      <p>{viewedUser.userAge}</p>
                    </div>

                    <button
                      className={"Matching-Button-ViewChange"}
                      onClick={this.onViewMoreInfoHandler}
                    >
                      <AttentionSeeker effect="headShake">
                        <i className="fas fa-user-cog fa-2x"></i>
                      </AttentionSeeker>
                    </button>
                  </div>
                )}

               <button>
                 Message
               </button>

               <button>
                 Dislike
               </button>

                <ToggleBar
                  clicked={this.onViewSwitchHandler}
                  icons={
                    <>
                      <i className="fas fa-dog fa-2x "></i>
                      <i className="fas fa-user fa-2x "></i>
                    </>
                  }
                ></ToggleBar>
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
    userData: state.matches.userData,
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
