import React, { Component } from "react";
import Select from "react-select";
import CardHolder from "./CardHolder/CardHolder";
import Spinner from "../../UI/Spinner/Spinner";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import "./Matching.css";

export class Match extends Component {
  state = {
    matchIndex: 0,
    transition: "",
  };

  nextClickHandler = () => {
    //this is where the index should be updated on a click

    let indexboudry = this.props.filteredMatches.length - 1;

    if (this.state.transition === "slide") {
      this.setState({
        matchIndex:
          this.state.matchIndex >= indexboudry ? 0 : this.state.matchIndex + 1,
      });
    } else {
      this.setState(
        {
          transition: "slide",
        },
        () =>
          this.setState({
            matchIndex:
              this.state.matchIndex >= indexboudry
                ? 0
                : this.state.matchIndex + 1,
          })
      );
    }
  };

  likeClickHandler = () => {
    const currentMatch = this.props.filteredMatches[this.state.matchIndex];
    const indexBoundry = this.props.filteredMatches.length - 1;

    if (this.state.transition === "like") {
      this.setState({
        matchIndex:
          this.state.matchIndex === indexBoundry &&
          this.state.matchIndex + 1 > 1
            ? this.state.matchIndex - 1
            : this.state.matchIndex,
      });
    } else {
      this.setState(
        {
          transition: "like",
        },
        () => {
          this.setState({
            matchIndex:
              this.state.matchIndex === indexBoundry &&
              this.state.matchIndex + 1 > 1
                ? this.state.matchIndex - 1
                : this.state.matchIndex,
          });
        }
      );
    }

    this.props.onPostLikedUsers(
      this.props.userToken,
      this.props.userData.userId,
      currentMatch.userId
    );
  };

  selectChangedHandler = (e) => {
    if (this.state.transition === "fade") {
      this.setState({
        matchIndex: 0,
      });
      this.props.onFilterMatches(e.value);
    } else {
      this.setState(
        {
          transition: "fade",
        },
        () => {
          this.setState({
            matchIndex: 0,
          });
          this.props.onFilterMatches(e.value);
        }
      );
    }
  };

  componentDidMount() {
    this.props.onFetchMatches(localStorage.getItem("userId"));
    this.props.onFetchLikedUsers(
      localStorage.getItem("userId"),
      localStorage.getItem("token")
    );
  }

  render() {
    const {
      selectedLocation,
      locationOptions,
      filteredMatches,
      userData,
      loading,
    } = this.props;
    const { matchIndex, transition } = this.state;

    let form = <Spinner />;


    const cardHolder = filteredMatches.length ? (
      <SwitchTransition mode={"out-in"}>
        <CSSTransition
          in={true}
          key={filteredMatches[matchIndex].userId}
          timeout={300}
          classNames={transition}
        >
          <CardHolder
            filteredMatchesLength={filteredMatches.length}
            matchName={
              !filteredMatches.length
                ? "NQMA DANNI "
                : filteredMatches[matchIndex].firstName
            }
            matchLocation={
              !filteredMatches.length
                ? "NQMA DANNI "
                : filteredMatches[matchIndex].location
            }
          />
        </CSSTransition>
      </SwitchTransition>
    ) : (
      <div> No data</div>
    );

    if (!loading) {
      form = (
        <form className="Form">
          <span className="UserName">Welcome {userData.firstName}</span>
          <Select
            className="SelectBar"
            options={locationOptions}
            value={
              selectedLocation
                ? { label: selectedLocation, value: selectedLocation }
                : { label: userData.location, value: userData.location }
            }
            onChange={this.selectChangedHandler}
          ></Select>
          {cardHolder}
        </form>
      );
    }

    return (
      <div className="Match-Wrapper">
        {form}

        <div>
          <button
            disabled={!filteredMatches.length}
            className="Button"
            onClick={this.likeClickHandler}
          >
            Like
          </button>
          <button
            disabled={filteredMatches.length <= 1}
            className="Button"
            onClick={this.nextClickHandler}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.matches.loading,
    matches: state.matches.matches,
    userToken: state.auth.token,
    filteredMatches: state.matches.matchesDataFiltered,
    userData: state.matches.userData,
    userId: state.matches.matches.userId,
    matchData: state.matches.matchData,
    locations: state.matches.locations,
    locationOptions: state.matches.locationOptions,
    selectedLocation: state.matches.selectedLocation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchMatches: (userId) => dispatch(actions.fetchMatches(userId)),
    onFilterMatches: (matches, filterValue) =>
      dispatch(actions.matchesFilter(matches, filterValue)),
    onPostLikedUsers: (token, userId, likedUserId) =>
      dispatch(actions.postLikedUsers(token, userId, likedUserId)),
    onFetchLikedUsers: (userId, token) =>
      dispatch(actions.fetchLikedUsers(userId, token)),
    // onFetchAllLikedUsers: (token) => dispatch(actions.fetchAllUserData(token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Match);