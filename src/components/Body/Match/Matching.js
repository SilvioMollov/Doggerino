import React, { Component } from "react";
import Select from "react-select";
import CardHolder from "./CardHolder/CardHolder";
import Spinner from "../../UI/Spinner/Spinner";
import ToolTip from "../../UI/ToolTip/ToolTip";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { withRouter } from "react-router";
import Modal from "../../UI/Modal/Modal";
import { connect } from "react-redux";
import { processValidity } from "../../../shared/utility";
import * as actions from "../../../store/actions/index";
import "./Matching.css";
import { AttentionSeeker } from "react-awesome-reveal";

export class Match extends Component {
  state = {
    matchIndex: 0,
    transition: "",
    showFilters: false,
    userView: false,
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

  userViewHandler = (e) => {
    e.preventDefault();

    this.setState({ userView: !this.state.userView });
  };

  render() {
    const {
      locationOptions,
      breedOptions,
      filteredMatches,
      userData,
      loading,
    } = this.props;
    const { matchIndex, transition, showFilters, userView } = this.state;

    let userCardHolderClass = "Ontop";

    if (userView) {
      userCardHolderClass = "Ontop Open";
    }

    return (
      <div className="Matching-Wrapper">
        {!loading ? (
          <form className="Matching-Form">
            <ToolTip
              header={"Hey there!"}
              content={
                "Here is where all the magic happens! Filter Me! provides a couple of filters, later on you will be able to like the user you want.  "
              }
            >
              <h3 className="Matching-Header">Welcome {userData.firstName}</h3>
              <button
                onClick={this.selectFiltersHandler}
                className={"Matching-Filter-Button"}
              >
                Filter me!
              </button>
              <Modal
                show={showFilters}
                closed={this.selectFiltersHandler}
                keyDown={this.onKeyPressHandler}
              >
                <Select
                  isClearable
                  className="Matching-SelectBar"
                  options={locationOptions}
                  name={"selectedLocation"}
                  onChange={(event, name) =>
                    this.selectChangedHandler(event, name)
                  }
                  placeholder={"Filter by Location"}
                ></Select>
                <Select
                  isClearable
                  className="Matching-SelectBar"
                  options={breedOptions}
                  name={"selectedBreed"}
                  onChange={(event, name) =>
                    this.selectChangedHandler(event, name)
                  }
                  placeholder={"Filter by breed"}
                ></Select>
                <Select
                  isClearable
                  className="Matching-SelectBar"
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                  ]}
                  name={"selectedGender"}
                  onChange={(event, name) =>
                    this.selectChangedHandler(event, name)
                  }
                  placeholder={"Filter by gender"}
                ></Select>
                <button
                  onClick={this.applyFilterChanges}
                  className={"Matching-Apply"}
                >
                  Apply Changes
                </button>
              </Modal>
              {Boolean(filteredMatches.length) ? (
                <SwitchTransition mode={"out-in"}>
                  <CSSTransition
                    in={true}
                    key={filteredMatches[matchIndex].userId}
                    timeout={300}
                    classNames={transition}
                  >
                    <div className={"Matching-CardHolderWrapper"}>
                      <CardHolder
                        isDog={false}
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
                      <div className={userCardHolderClass}>
                        <CardHolder
                          isDog={true}
                          petGender={
                            filteredMatches[matchIndex].petData.petGender
                              ? filteredMatches[matchIndex].petData.petGender
                              : "Your Pet's Gender"
                          }
                          petName={
                            filteredMatches[matchIndex].petData.petName
                              ? filteredMatches[matchIndex].petData.petName
                              : "Your Pet's Name"
                          }
                          petBreed={
                            filteredMatches[matchIndex].petData.petBreed
                              ? filteredMatches[matchIndex].petData.petBreed
                              : "Breed"
                          }
                          petAge={
                            filteredMatches[matchIndex].petData.petAge
                              ? filteredMatches[matchIndex].petData.petAge
                              : "Age"
                          }
                          petDescription={
                            filteredMatches[matchIndex].petData.petDescription
                          }
                        />
                      </div>

                      <button
                        className={"Matching-Button-ViewChange"}
                        onClick={this.userViewHandler}
                      >
                        <AttentionSeeker effect="headShake">
                          <i className="fas fa-user-cog fa-2x"></i>
                        </AttentionSeeker>
                      </button>
                    </div>
                  </CSSTransition>
                </SwitchTransition>
              ) : (
                <Spinner />
              )}
            </ToolTip>
          </form>
        ) : (
          <Spinner>
            
          </Spinner>
        )}

        <div>
          <button
            disabled={!filteredMatches.length}
            className="Matching-Button"
            onClick={this.likeClickHandler}
          >
            <i className="fas fa-heart fa-2x"></i>
          </button>

          <button
            disabled={filteredMatches.length <= 1}
            className="Matching-Button"
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
