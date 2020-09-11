import React, { Component } from "react";
import Match from "../Body/Matched/Match/Match";
import Spinner from "../UI/Spinner/Spinner";
import Modal from "../UI/Modal/Modal";
import { connect } from "react-redux";
import * as actions from "../../store/actions/index";

import "./Admin.css";

export class Admin extends Component {
  state = {
    editing: false,
  };

  onClickHandler = (user) => {
    const { allUsers, onDeleteUser } = this.props;

    this.setState({ editing: !this.state.editing });

    // const objectArr = Object.entries(allUsers);

    // const pickedUser = objectArr.find(([key, value]) =>
    //   Object.values(value).includes(user.userId)
    // );

    // onDeleteUser(pickedUser, localStorage.getItem("token"));
  };

  onEditingCancelHandler = () => {
    this.setState({ editing: false });
  };

  render() {
    const { allMatches } = this.props;

    let users = <Spinner></Spinner>;

    if (allMatches.length) {
      users = allMatches.map((user) => (
        <div key={user.userId}>
          <Match
            clickHandler={() => {
              this.git(user);
            }}
            isAdminView={true}
            id={user.userId}
            email={user.email}
            firstName={user.firstName}
            lastName={user.lastName}
          ></Match>
        </div>
      ));
    }

    return (
      <>
        <div className="Admin-Wrapper">
          {users}
          <Modal show={this.state.editing} closed={this.onEditingCancelHandler}>
            <div>Proceede with delete or Edit the user</div>
            <button>Edit</button>
            <button>Delete</button>
          </Modal>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allUsers: state.admin.allUsers,
    allMatches: state.matches.matches,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDeleteUser: (userId, token) =>
      dispatch(actions.deleteUserFromDb(userId, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
