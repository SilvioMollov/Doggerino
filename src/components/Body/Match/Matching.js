import React, { Component } from "react";
import Select from "react-select";
import CardHolder from "./CardHolder/CardHolder";
import Spinner from "../../UI/Spinner/Spinner";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { withRouter } from "react-router";
import Modal from "../../UI/Modal/Modal";
import { connect } from "react-redux";
import { processValidity } from "../../../shared/utility";
import * as actions from "../../../store/actions/index";
import "./Matching.css";

export class Match extends Component {
  state = {
    matchIndex: 0,
    transition: "",
    showFilters: false,
    selectFilters: {
      selectedLocation: {
        value: "",
        validation: {
          requered: true,
        },
        valid: false,
        touched: false,
      },
      selectedBreed: {
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
      selectedGender: {
        value: "",
        validation: {
          required: true,
        },
        valid: false,
        touched: false,
      },
    },
  };

  nextClickHandler = () => {
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

  selectChangedHandler = (event, inputType) => {
    const { selectFilters } = this.state;

    if (event === null) {
      event = { value: "", label: "" };
    }

    const updatedSelectState = {
      ...selectFilters,
      [inputType.name]: {
        ...selectFilters[inputType.name],
        value: event.value,
        valid: processValidity(event.value, selectFilters[inputType.name]),
        touched: true,
      },
    };

    if (this.state.transition === "fade") {
      this.setState({
        matchIndex: 0,
        selectFilters: updatedSelectState,
      });
    } else {
      this.setState(
        {
          transition: "fade",
        },
        () => {
          this.setState({
            matchIndex: 0,
            selectFilters: updatedSelectState,
          });
        }
      );
    }
  };

  componentDidMount() {
    this.props.onFetchMatches(
      localStorage.getItem("userId"),
      localStorage.getItem("token")
    );
    this.props.onFetchLikedUsers(
      localStorage.getItem("userId"),
      localStorage.getItem("token")
    );
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const { userData, history } = this.props;
  //   // NEEDS WORK
  //   // if (
  //   //   prevProps.userData !== userData &&
  //   //   !Object.keys(userData.petData).length
  //   // ) {
  //   //   history.push("/userProfile");
  //   //   console.log("im in");
  //   // }
  // }

  applyFilterChanges = (e) => {
    e.preventDefault();

    const {
      selectFilters: { selectedBreed, selectedLocation, selectedGender },
    } = this.state;
    const { onFilterMatches } = this.props;

    this.selectFiltersHandler(e);

    onFilterMatches(
      selectedLocation.value,
      selectedBreed.value,
      selectedGender.value
    );
  };

  selectFiltersHandler = (e) => {
    e.preventDefault();
    this.setState(
      {
        showFilters: !this.state.showFilters,
      },
      () => {
        if (this.state.showFilters) {
          document.addEventListener("keydown", this.onKeyPressHandler);
        } else {
          document.removeEventListener("keydown", this.onKeyPressHandler);
        }
      }
    );
  };

  onKeyPressHandler = (e) => {
    if (e.keyCode === 27) {
      this.setState({ showFilters: !this.state.showFilters });
    }
  };

  render() {
    const {
      locationOptions,
      breedOptions,
      filteredMatches,
      userData,
      loading,
    } = this.props;
    const { matchIndex, transition, showFilters } = this.state;

    let form = <Spinner />;

    const cardHolder = filteredMatches.length ? (
      <SwitchTransition mode={"out-in"}>
        <CSSTransition
          in={true}
          key={filteredMatches[matchIndex].userId}
          timeout={300}
          classNames={transition}
        >
          {Boolean(filteredMatches.length) ? (
            <CardHolder
              filteredMatchesLength={filteredMatches.length}
              matchFirstName={
                !filteredMatches.length
                  ? "NQMA DANNI "
                  : filteredMatches[matchIndex].firstName
              }
              matchLastName={
                !filteredMatches.length
                  ? "NQMA DANNI "
                  : filteredMatches[matchIndex].lastName
              }
              userAge={
                !filteredMatches.length
                  ? "NQMA DANNI "
                  : filteredMatches[matchIndex].userAge
              }
              matchLocation={
                !filteredMatches.length
                  ? "NQMA DANNI "
                  : filteredMatches[matchIndex].location.city
              }
            />
          ) : (
            <Spinner />
          )}
        </CSSTransition>
      </SwitchTransition>
    ) : (
      <div> No data</div>
    );

    if (!loading) {
      form = (
        <form className="Match-Form">
          <h3 className="Match-Header">Welcome {userData.firstName}</h3>
          <button onClick={this.selectFiltersHandler}>set filters</button>
          <Modal
            show={showFilters}
            closed={this.selectFiltersHandler}
            keyDown={this.onKeyPressHandler}
          >
            <Select
              isClearable
              className="Match-SelectBar"
              options={locationOptions}
              name={"selectedLocation"}
              // value={
              //   // selectedLocation
              //   // { label: selectedLocation, value: selectedLocation }
              //   // : { label: userData.location.city, value: userData.location.city }
              // }
              onChange={(event, name) => this.selectChangedHandler(event, name)}
              placeholder={"Filter on location"}
            ></Select>
            <Select
              isClearable
              className="Match-SelectBar"
              options={breedOptions}
              name={"selectedBreed"}
              // value={{ label: selectedBreed, value: selectedBreed }}
              onChange={(event, name) => this.selectChangedHandler(event, name)}
              placeholder={"Filter your dog's breed"}
            ></Select>
            <Select
              isClearable
              className="Match-SelectBar"
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
              name={"selectedGender"}
              // value={
              //   selectedGenderIsMale
              //     ? { label: "Male", value: "Male" }
              //     : { value: "Female", label: "Female" }
              // }
              onChange={(event, name) => this.selectChangedHandler(event, name)}
              placeholder={"Filter your dog's gender"}
            ></Select>
            <button onClick={this.applyFilterChanges}>Apply Changes</button>
          </Modal>
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
            className="Match-Button"
            onClick={this.likeClickHandler}
          >
            <i className="fas fa-heart fa-2x"></i>
          </button>

          <button
            disabled={filteredMatches.length <= 1}
            className="Match-Button"
            onClick={this.nextClickHandler}
          >
            <i className="fas fa-arrow-circle-right fa-2x"></i>
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
    breedOptions: state.matches.breedOptions,
    selectedBreed: state.matches.selectedBreed,
    selectedGenderIsMale: state.matches.selectedGenderIsMale,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchMatches: (userId, token) =>
      dispatch(actions.fetchMatches(userId, token)),
    onFilterMatches: (
      locationFilterValue,
      breedFilterValue,
      genderFilterValue
    ) =>
      dispatch(
        actions.matchesFilter(
          locationFilterValue,
          breedFilterValue,
          genderFilterValue
        )
      ),
    onPostLikedUsers: (token, userId, likedUserId) =>
      dispatch(actions.postLikedUsers(token, userId, likedUserId)),
    onFetchLikedUsers: (userId, token) =>
      dispatch(actions.fetchLikedUsers(userId, token)),
    // onFetchAllLikedUsers: (token) => dispatch(actions.fetchAllUserData(token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Match));
